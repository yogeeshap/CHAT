import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Fab, IconButton, Typography } from '@mui/material';
import PhoneDisabledRoundedIcon from '@mui/icons-material/PhoneDisabledRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';

interface MediaProps {
  roomId: string;
  userId: string;
  // hostId:string
}

const MediaController: React.FC<MediaProps> = ({ roomId, userId}) => {
  const wsRef = useRef<WebSocket | null>(null);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState<any | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
  // const [callStarted, setCallStarted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peers = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const remoteVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  // const [isHost, setIsHost] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  // const [mediaReady, setMediaReady] = useState(false);
  const [userCount, setUserCount] = useState(0);
  // const [participants, setParticipants] = useState<string[]>([]);
  // const [hostId, setHostId] = useState<string | null>(null);
  // const [userList, setUserList] = useState<string[]>([]);
  const [leftUser, setLeftUser] = useState<string | null>(null);

  const WS_BASE_URL = 'ws://127.0.0.1:8000/ws';
  
  const navigate = useNavigate();
  // const isHost = userId === hostId;

  useEffect(() => {
  if (leftUser  && leftUser === userId) {
    const timeout = setTimeout(() => {
      // navigate('/');
      window.close();
    }, 2000); // Wait 2 seconds
    return () => clearTimeout(timeout);
  }
}, [leftUser]);

  const prepareMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    // setMediaReady(true);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
};

useEffect(() => {
  prepareMedia();
}, []);


  const createPeer = useCallback((peerId: string) => {
  const pc = new RTCPeerConnection();
  

  // Add to refs first before adding tracks/events
  peers.current[peerId] = pc;

  // Add local media tracks
  const stream = localStreamRef.current;
  if (stream) {
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });
  }

  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      wsRef.current?.send(JSON.stringify({
        type: "candidate", // 'ice-candidate' is more descriptive than 'candidate'
        candidate: event.candidate,
        sender: userId,
        target: peerId,
      }));
    }
  };

  // Handle incoming remote tracks
  pc.ontrack = (event) => {
    const remoteStream = new MediaStream();
    event.streams[0]?.getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });

    setRemoteStreams(prev => ({
      ...prev,
      [peerId]: remoteStream,
    }));
  };

  return pc;
}, [userId]);


  const callAll = useCallback(async () => {
  try {

    if (!userId) return
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    // setCallStarted(true); // triggers UI to show video

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    Object.keys(remoteStreams).forEach(async (peerId) => {
      const pc = createPeer(peerId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsRef.current?.send(JSON.stringify({
        type: "offer",
        offer,
        sender: userId,
        target: peerId
      }));
    });
    
  } catch (err) {
    console.error("Error accessing media devices:", err);
  }
},[remoteStreams]);



//   const endCall = useCallback(() => {
//     if (!userId) return
//   // Stop all tracks of local stream
//   
//   if (localStreamRef.current) {
//     // 
//     localStreamRef.current.getTracks().forEach((track) => track.stop());
//     localStreamRef.current = null; // <-- Important!
//     // 
//   }

//   // Close all peer connections
//   Object.values(peers.current).forEach((pc) => {
//     pc.close();
//   });

//   // Clear peer connections and remote streams
//   peers.current = {};
//   setRemoteStreams({});
//   remoteVideoRefs.current = {};

//   // Clear local video
//   if (localVideoRef.current) {
//     localVideoRef.current.srcObject = null;
//   }

  
//   // Optionally notify others
//   if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//     wsRef.current.send(
//       JSON.stringify({
//         type: "end_call",
//         sender: userId,
//       })
//     );
//   }

//   setCallStarted(false); // hide video
//   setHasJoined(false);

//   
// },[callStarted,remoteStreams,hasJoined]);

const endCall = useCallback(() => {
  if (!userId) return;

  // Stop local media tracks
  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
  }

  // Close all peer connections
  Object.values(peers.current).forEach(pc => pc.close());

  // Clear peer refs and streams
  peers.current = {};
  setRemoteStreams({});
  remoteVideoRefs.current = {};

  // Clear local video element
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }

  // Notify backend and peers
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({
      type: "left_call",
      sender: userId,  // ensure consistency
    }));
    wsRef.current.close();
  }

  // setCallStarted(false);
  setHasJoined(false);

  

  
}, [userId]);

const joinCall = useCallback(async () => {
  try {
    if (!userId) return
    // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // localStreamRef.current = stream;

    // if (localVideoRef.current) {
    //   localVideoRef.current.srcObject = stream;
    // }

    setHasJoined(true);
    // Notify others you're ready
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "join_call",
        sender: userId
      }));
    }

    // Call all other peers already in call
    callAll();
  } catch (error) {
    console.error("Error joining call:", error);
  }
},[]);

  useEffect(() => {
  const setup = async () => {
    try {

      if (!userId) {
        return
      }

      // WebSocket connection
      const ws = new WebSocket(`wss://localhost:8000/ws/chat/${roomId}/${userId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        
        switch (data.type) {

          case "offer": {
            const pc = createPeer(data.sender);
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            wsRef.current?.send(JSON.stringify({
              type: "answer",
              answer,
              sender: userId,
              target: data.sender
            }));
            break;
          }

          case "answer": {
            await peers.current[data.sender].setRemoteDescription(new RTCSessionDescription(data.answer));
            break;
          }

          case "candidate": {
            await peers.current[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
          }

          case "join_call": {
            
          const newPeer = data.sender;
          const userCount = data.user_count;
          if (!newPeer || newPeer === userId || peers.current[newPeer]) break;
          
          // if (data.sender === userId) {
          //   setIsHost(data.is_host);  // you are the host!
          // }

          setUserCount(userCount)
          // setParticipants(data.users);
          // setHostId(data.host);
          const pc = createPeer(newPeer); // Your existing function
          peers.current[newPeer] = pc;

          // Add local tracks to peer connection
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track =>
              pc.addTrack(track, localStreamRef.current!)
            );
          }

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          wsRef.current?.send(JSON.stringify({
            type: "offer",
            offer,
            sender: userId,
            target: newPeer,
          }));
        
          break;
        }

        case "left_call": {
          const leftUserId = data.user_id;
          

            // 2. Close the peer connection
          if (peers.current[leftUserId]) {
            peers.current[leftUserId].close();
            delete peers.current[leftUserId];
          }

          // 3. Remove video ref (cleanup)
          delete remoteVideoRefs.current[leftUserId];

          // ✅ Remove their remote stream
          setRemoteStreams(prev => {
            const updated = { ...prev };
            delete updated[leftUserId];
            return updated;
          });

          // ✅ Optional: Show updated user list or count
          // setUserList(data.users); // or setUserCount(data.user_count)
          setUserCount(data.user_count)
          setLeftUser(leftUserId)

          break;
        }


          default:
            console.warn("Unknown message type:", data.type);
        }
      };

      ws.onclose = () => {
        
      };

    } catch (err) {
      console.error("Setup error:", err);
    }
  };

  setup();

  return () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  };
}, [roomId, userId]);


//   const sendMessage = () => {

//     
//     if (wsRef.current instanceof WebSocket) {
//       if(wsRef.current.readyState === WebSocket.OPEN){
//         let wsPayload:{ [key: string]: any } = {type: "message"}

//         if (input) {
//           
//           wsPayload['content'] = input
//         }
//         if(file){
//           const reader = new FileReader();
//           reader.onload = () => {
//             const result = reader.result
//             if (typeof result === "string") {
//             const base64Data = result.split(',')[1]; // Remove data:<type>;base64,
//             const payload = {
//               filename: file.name,
//               content_type: file.type,
//               data: base64Data,
//               image_height:imageHeight,
//               image_width:imageWidth
//             };

//             wsPayload = {...payload,...wsPayload}
//             wsRef.current?.send(JSON.stringify(wsPayload));
//           }
//           else {
//           console.error("reader.result is not a string");
//           }
//         }
//           reader.readAsDataURL(file);
//         }

//         if(input && !file){
//           wsRef.current.send(JSON.stringify(wsPayload));
//         }
//         setInput("");
//         setPreview(null);
//         sendTyping(false);
//   }
//   }
//   };


const toggleAudio = useCallback(() => {
  const stream = localStreamRef.current;
  if (stream instanceof MediaStream) {
    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setAudioEnabled(prev => !prev);
  }
},[]);

// const toggleVideo = useCallback(() => {
//   const stream = localStreamRef.current;
//   if (stream instanceof MediaStream) {
//     stream.getVideoTracks().forEach(track => {
//       track.enabled = !track.enabled;
//     });
//     setVideoEnabled(prev => !prev);
//   }
// },[]);

const toggleVideo = useCallback(async () => {
  const stream = localStreamRef.current;

  if (!stream) return;

  const videoTracks = stream.getVideoTracks();

  if (videoTracks.length > 0 && videoEnabled) {
    // Turn OFF video: stop and remove track from stream
    videoTracks.forEach((track) => {
      track.stop(); // release hardware
      stream.removeTrack(track);
    });

    // Remove from all peers
    Object.values(peers.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) pc.removeTrack(sender);
    });

    setVideoEnabled(false);
  } else {
    // Turn ON video: add track to stream
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newTrack = newStream.getVideoTracks()[0];
      stream.addTrack(newTrack);

      // Add to peers
      Object.values(peers.current).forEach(pc => {
        pc.addTrack(newTrack, stream);
      });

      setVideoEnabled(true);
    } catch (err) {
      console.error("Failed to re-enable video:", err);
    }
  }
}, [videoEnabled]);



  return (

  <Box component="main" sx={{
    height: '100vh',              // Full viewport height
    width: '100vw',               // Full viewport width (optional)
    display: 'grid',
    placeItems: 'center',         // Center both horizontally and vertically
    p: 4,
    gap: 4,
  }}>
    {leftUser ? (
  <Box
    sx={{
      height: '100vh',
      display: 'grid',
      placeItems: 'center',
      backgroundColor: '#f8f8f8',
      textAlign: 'center',
      p: 4,
    }}
  >
    <Typography variant="h4" gutterBottom>Call Ended</Typography>
    <Button variant="contained" onClick={() => navigate('/')}>Chat Box</Button>
  </Box>
):
    <Box sx={{ display: 'flex',
     flexDirection: 'column', 
     alignItems: 'center', 
     gap: 2 }}>
  <video
    ref={(ref) => {
      if (ref instanceof HTMLVideoElement && localStreamRef.current) {
        ref.srcObject = localStreamRef.current;
        localVideoRef.current = ref;
      }
    }}
    autoPlay
    muted
    playsInline
    style={hasJoined? {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "black",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 1 // Just hide it if not joined
    }:undefined}
  />
   {!videoEnabled && (
    <Box
      sx={{
        // position: "absolute",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        objectFit:"contain",
        overflowClipMargin:"content-box",
        overflow:"clip",
        backgroundColor: "black",
        opacity: 1,
        // borderRadius: "12px",
      }}
    />
  )}
  <Box sx={hasJoined?{
        display: 'flex',
        gap: 1, 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        position:"absolute",
        bottom:30

        }:{ display: 'flex',
        gap: 1, 
        flexWrap: 'wrap', 
        justifyContent: 'center' }}>


  {!hasJoined && <Fab 
      variant="extended"
      color="primary"
      onClick={joinCall}>
    join call
    </Fab>
    }

  {hasJoined && (<><IconButton
  disabled={!userId}
  onClick={endCall}
  sx={{
    width: 50,
    height: 50,
    background:"#e79292"
  }}
>
  <PhoneDisabledRoundedIcon sx={{ fontSize: 30 }}/>
</IconButton>

<IconButton
  onClick={toggleAudio}
  sx={{
    width: 50,
    height: 50,
    background:"#ded4c5"
  }}
>
  {audioEnabled ? <MicRoundedIcon sx={{ fontSize: 30 }}/> : <MicOffRoundedIcon sx={{ fontSize: 30 }}/>}
</IconButton>
<IconButton
disableRipple
  onClick={toggleVideo}
  sx={{
    width: 50,
    height: 50,
    background:"#8797ff"
  }}
>
  {videoEnabled ? <VideocamRoundedIcon sx={{ fontSize: 30 }}/> : <VideocamOffRoundedIcon sx={{ fontSize: 30 }}/>}
</IconButton></>)}
</Box>


{Object.entries(remoteStreams).map(([id, stream]) => (
  <div key={id}>
    <h2 className="text-xl">User {id.slice(0, 5)}</h2>
    <video
      autoPlay
      muted
      playsInline
      className="rounded-xl border"
      ref={(ref) => {
        if (ref instanceof HTMLVideoElement && stream instanceof MediaStream) {
          ref.srcObject = stream;
          remoteVideoRefs.current[id] = ref;
        }
      }}
    />
  </div>
))}

<Typography variant="subtitle1" align="center">
  {userCount} user{userCount === 1 ? '' : 's'} in call
</Typography>
</Box>}

{/* <Stack direction="row" spacing={1}>
  {participants.map((u) => (
    <Chip
      key={u}
      label={`${u.slice(0, 6)}${u === hostId ? " (Host)" : ""}`}
      color={u === hostId ? "success" : "default"}
      variant="outlined"
    />
  ))}
</Stack> */}
        </Box>

  );
};

export default MediaController;
