import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  InputAdornment,
  AppBar,
  Container,
  Toolbar,
  Tooltip,
  Avatar,
  Fab,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VideocamIcon from "@mui/icons-material/Videocam";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import {
  useAppDispatch,
  useAppSelector,
} from "../../services/hooks/store-hooks";
import { fetchRoom, fetchRoomUsers } from "../../store/slice/thunk";
import {setActiveRoomUser} from '../../store/slice/chatSlice'
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import AddMainModal from "./AddRoomModal";
import EditRoomModal from "./EditRoomModel";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ParticipantsModal from "./ParticipantsModel";
import authConfig from '../../authConfig'
import { useNavigate } from "react-router-dom";

interface ChatProps {
  roomId: string;
  userId: string;
}

type Message = {
  id: string;
  content: string;
  timestamp: string; // or Date if you're parsing it
  edited_at?: string | null;
  reactions?: { [emoji: string]: string[] };
  imageUrl?: string;
  image_height?: number;
  image_width?: number;
};

type UserDetail = {
  user_id?: string;
  username?: string;
  email?: string;
  room_name?: string;
  room_id?: string;
};

type Room = {
  room_id: string;
  name: string;
};

const Chat: React.FC<ChatProps> = ({ roomId, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [file, setFile] = useState<any | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(0);
  const [imageWidth, setImageWidth] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const topRef = useRef<HTMLDivElement>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const sourceRef = useRef<HTMLFormElement>(null);

  const [sourceElementSize, setSourceElementSize] = useState<number | null>(50);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [participants, setParticipants] = useState<UserDetail[]>([]);
   const [participantsCount, setParticipantsCount] = useState<number | null>(0);
  const maxWidth = 350;
  const maxHeight = 250;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const allRoomUsers = useAppSelector<UserDetail[]>(
    (state) => state.chat.roomAllUser || []
  );

  const activeRoomUser = useAppSelector<ChatProps>(
    (state) => state.chat.activeRoomUser || {}
  );




  const room = useAppSelector<Room>((state) => state.chat.room);

  useEffect(() => {
    const element = sourceRef.current;

    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        setSourceElementSize(height);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.marginBottom = `${sourceElementSize}px`;
    }
  }, [sourceElementSize]);

  useEffect(() => {
  if (roomId && userId) {
    if (
      activeRoomUser.roomId !== roomId ||
      activeRoomUser.userId !== userId
    ){
    setInput("");
    setFile(null);
    setPreview(null);

    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchRoomUsers(roomId)),
        dispatch(fetchRoom(roomId)),
      ]);
    };

    fetchData();
      dispatch(setActiveRoomUser({ activeRoomUser: { roomId, userId } }));
    }
  }
}, [dispatch, roomId, userId]);


  useEffect(() => {
    if (!topRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          wsRef.current?.readyState === WebSocket.OPEN
        ) {
          setLoading(true);
          wsRef.current.send(
            JSON.stringify({
              type: "load_older",
              start_cursor: messages[0]?.timestamp,
            })
          );
        }
      },
      {
        root: containerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [messages, hasMore, loading]);

  const simulateReceiveImage = (byteArray: Uint8Array) => {
    const url = `data:image/png;base64,${byteArray}`;
    return url;
  };

  useEffect(() => {
    if (initialLoaded) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [initialLoaded]);

  useEffect(() => {
    const setup = async () => {
      try {
        if (!userId) {
          setLoadingInitial(false);
          return;
        }
        setLoadingInitial(true);

        // WebSocket connection
        const ws = new WebSocket(
          `${authConfig.auth.wsUrl}/chat/${roomId}/${userId}`
        );
        wsRef.current = ws;

        ws.onopen = () => {
          
        };

        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          

          switch (data.type) {
            case "history":
              
              const enrichedMessages = data.messages.map((msg: any) => {
                if (msg.f_data) {
                  msg.imageUrl = simulateReceiveImage(msg.f_data);
                }
                return msg;
              });
              setMessages(enrichedMessages.reverse());
              setTimeout(() => {
                setLoadingInitial(false);
                setInitialLoaded(true);
              }, 0);
              break;

            case "older_messages":
              
              const oldMessages = data.messages.map((msg: any) => {
                if (msg.f_data) {
                  msg.imageUrl = simulateReceiveImage(msg.f_data);
                }
                return msg;
              });
              setMessages(oldMessages);
              setHasMore(oldMessages.length > 0);
              setLoading(false);
              // setLoadingOlder(false);
              break;

            case "message_update":
              
              setMessages((msgs) => {
                const idx = msgs.findIndex(
                  (m: any) => m.id === data.message.id
                );
                const updatedMessage = { ...data.message };
                if (updatedMessage.f_data) {
                  updatedMessage.imageUrl = simulateReceiveImage(
                    updatedMessage.f_data
                  );
                }

                if (idx >= 0) {
                  const newMsgs = [...msgs];
                  newMsgs[idx] = updatedMessage;
                  return newMsgs;
                } else {
                  return [...msgs, updatedMessage];
                }
              });
              break;

            case "typing":
              setTypingUsers((prev) => {
                const newSet = new Set(prev);
                data.is_typing
                  ? newSet.add(data.user_id)
                  : newSet.delete(data.user_id);
                return newSet;
              });
              break;

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      messages.forEach((msg: any) => {
        if (msg.imageUrl) {
          URL.revokeObjectURL(msg.imageUrl);
        }
      });
    };
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const f = event.target.files?.[0];
      setFile(f);
      if (!f) return;

      const fileType = f.type;
      const fileName = f.name.toLowerCase();

      

      const reader = new FileReader();

      if (fileType.startsWith("image/")) {
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") {
            const img = new Image();
            img.onload = () => {
              const widthRatio = maxWidth / img.width;
              const heightRatio = maxHeight / img.height;
              const scale = Math.min(widthRatio, heightRatio, 1);
              setPreview(result);
              setImageWidth(img.width * scale);
              setImageHeight(img.height * scale);
            };
            img.src = result;
          }
        };
        reader.readAsDataURL(f);
      } else if (fileType === "application/pdf") {
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setPreview(reader.result); // You can embed this in <iframe src={preview} />
          }
        };
        reader.readAsDataURL(f);
      } else if (
        fileType.startsWith("text/") ||
        fileName.endsWith(".csv") ||
        fileName.endsWith(".tsv")
      ) {
        reader.onload = () => {
          const text = reader.result as string;
          setPreview(text); // show in <pre> or scrollable <div>
        };
        reader.readAsText(f);
      } else if (
        fileName.endsWith(".xlsx") ||
        fileName.endsWith(".xls") ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setPreview("Excel File: " + f.name); // optionally parse using SheetJS (xlsx library)
      } else if (fileName.endsWith(".zip")) {
        setPreview("ZIP File: " + f.name);
      } else {
        setPreview("Unsupported file type: " + f.name);
      }
    },
    []
  );

  const sendMessage = useCallback(() => {
    if (wsRef.current instanceof WebSocket) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        let wsPayload: { [key: string]: any } = { type: "message" };

        if (input) {
          
          wsPayload["content"] = input;
        }
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
              const base64Data = result.split(",")[1]; // Remove data:<type>;base64,
              const payload = {
                filename: file.name,
                content_type: file.type,
                data: base64Data,
                image_height: imageHeight,
                image_width: imageWidth,
              };

              wsPayload = { ...payload, ...wsPayload };
              wsRef.current?.send(JSON.stringify(wsPayload));
            } else {
              console.error("reader.result is not a string");
            }
          };
          reader.readAsDataURL(file);
        }

        if (input && !file) {
          
          wsRef.current.send(JSON.stringify(wsPayload));
        }
        setInput("");
        setPreview(null);
        sendTyping(false);
      }
    }
  }, [input, file, imageHeight, imageWidth]);

  // Send typing indicator helper (debounced)
  const sendTyping = useCallback((isTyping: boolean) => {
    wsRef.current?.send(
      JSON.stringify({ type: "typing", is_typing: isTyping })
    );
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
      sendTyping(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = window.setTimeout(() => {
        sendTyping(false);
      }, 1500);
    },
    []
  );

  // Helper: format ISO timestamp to local time string
  const formatTimestamp = useCallback((ts: any) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      
      if (e.key === "Enter") {
        
        if (e.shiftKey) {
          // Allow new line — do NOT prevent default
          return;
        } else {
          e.preventDefault(); // Prevent form submission
          sendMessage(); // Your custom send/submit logic
        }
      }

      if (e.key === "Backspace") {
        // If input is empty and Backspace pressed, clear image/file
        if (input.length === 0 && preview) {
          setPreview(null);
          setFile(null);
          // optionally clear input too
          setInput("");
        }
      }
    },
    [input]
  );

  const handleMedia = useCallback(() => {
    // window.open(
    //   `/meet-me/${roomId}/${userId}`,
    //   "_blank",
    //   "noopener,noreferrer"
    // );
    navigate(`/meet-me/${roomId}/${userId}`)
    
  }, [roomId, userId]);

  const removeFile = useCallback(() => {
    setPreview(null);
    setFile(null);
  }, []);

  const handleAddRoom = useCallback(() => {
    setOpenAdd(true);
  }, []);

  const handleEditRoom = useCallback(() => {
    setOpenEdit(true);
  }, []);

  const handleEditClose = useCallback(() => {
    setOpenEdit(false);
  },[]);

  const handleAddClose = useCallback(() => {
    setOpenAdd(false);
  },[]);

  const handleParticipantsOpen = useCallback(() => {
    setOpenParticipants(true);
  },[]);

  const handleParticipantsClose = useCallback(() => {
    setOpenParticipants(false);
  },[]);


    useEffect(() => {
    setParticipants(allRoomUsers);
    setParticipantsCount(allRoomUsers.length);
  }, [allRoomUsers]);


  return (
    <Box
      component="main"
      sx={{
        padding: 1,
        display: "flex",
        flexDirection: "column",
        height: "-webkit-fill-available",
        // filter: "contrast(80%) brightness(100%)"
      }}
    >
      <AppBar position="static" sx={{ background: "none" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Tooltip title="Room">
                  <Avatar alt="Room">
                    {room.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
                <Typography variant="body1" color="text.secondary" ml={1}>
                  {room.name}
                </Typography>
                <EditRoomModal
                  open={openEdit}
                  onClose={handleEditClose}
                  selectedValue={roomId}
                />
                <Tooltip title="Edit Room">
                  <Fab
                    disableRipple
                    color="primary"
                    aria-label="add"
                    onClick={handleEditRoom}
                  >
                    <EditIcon/>
                  </Fab>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Add Users">
                  <Fab
                    disableRipple
                    color="primary"
                    aria-label="add"
                    // sx={{
                    //   width: 40,
                    //   height: 40,
                    //   // background:"#ded4c5"
                    // }}
                    onClick={handleAddRoom}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
                <AddMainModal
                  open={openAdd}
                  onClose={handleAddClose}
                  selectedValue={roomId}
                  userId={userId}
                  listOfValue={allRoomUsers}
                />
                <Tooltip title="Edit Room">
                  <Fab
                    disableRipple
                    color="primary"
                    aria-label="add"
                    // sx={{
                    //   width: 40,
                    //   height: 40,
                    //   // background:"#ded4c5"
                    // }}
                    onClick={handleParticipantsOpen}
                  >
                    <GroupAddRoundedIcon  />
                  </Fab>
                </Tooltip>
                <ParticipantsModal
                  open={openParticipants}
                  onClose={handleParticipantsClose}
                  listOfValue={allRoomUsers}
                />
                <Typography variant="body1">+{participantsCount}</Typography>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {loadingInitial ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" ml={1}>
            Getting Things for you...
          </Typography>
        </Box>
      ) : messages.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Typography variant="body1" color="text.secondary">
            No messages available.
          </Typography>
        </Box>
      ) : (
        <Box
          ref={containerRef}
          sx={{
            flexGrow: 1, // Fills available vertical space
            p: 2,
            overflowY: "auto", // scrollable
            mb: 6,
            // overflowY: "scroll",
            scrollbarWidth: "thin", // Firefox
            scrollbarColor: "transparent transparent",
            "&::-webkit-scrollbar": {
              width: "8px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "4px",
              visibility: "hidden",
              transition: "visibility 0.3s",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              visibility: "visible",
            },
            "&:active::-webkit-scrollbar-thumb": {
              visibility: "visible",
            },
          }}
        >
          <div ref={topRef} />
          {messages.map((msg: any) => (
            <Paper
              elevation={1}
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: 2,
                padding: 1.2,
                background: "##ffffff45",
                maxWidth: "fit-content", // 👈 Fit to content
                width: "fit-content", // Optional, both safe
                alignItems: "flex-start",
                wordBreak: "break-word",
                position: "relative",
              }}
            >
              {msg.edited_at && (
                <Typography
                  variant="body2"
                  component="span"
                  fontStyle="italic"
                  color="text.secondary"
                >
                  {" "}
                  (edited)
                </Typography>
              )}
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                {msg.content}
              </Typography>
              {msg.imageUrl && (
                <Box
                  component="img"
                  src={msg.imageUrl}
                  alt="Preview"
                  sx={{
                    width: msg.image_width || 120,
                    height: msg.image_height || 120,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    mt: 1,
                  }}
                ></Box>
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                {formatTimestamp(msg.timestamp)}
              </Typography>
              {msg.reactions &&
                Object.entries(msg.reactions as [string, []][]).map(
                  ([emoji, users]) => (
                    <Typography
                      key={emoji}
                      component="span"
                      sx={{ mr: 1, cursor: "pointer" }}
                      onClick={() =>
                        wsRef.current?.send(
                          JSON.stringify({
                            type: "reaction",
                            id: msg.id,
                            reaction: emoji,
                          })
                        )
                      }
                      title={`Users: ${users.join(", ")}`}
                    >
                      {emoji} {users.length}
                    </Typography>
                  )
                )}
            </Paper>
          ))}
          <div ref={bottomRef} />
        </Box>
      )}
      {typingUsers.size > 0 && (
        <Typography
          sx={{
            fontStyle: "italic",
            marginBottom: 0,
            marginLeft: "6rem",
            zIndex: 1,
          }}
        >
          {Array.from(typingUsers)
            .filter((u) => u !== userId)
            .join(", ")}{" "}
          typing...
        </Typography>
      )}
      <Stack
        ref={sourceRef}
        component="form"
        direction="row"
        sx={{
          width: "-webkit-fill-available",
          position: "absolute",
          bottom: 0,
          paddingRight: 2,
          alignItems: "end",
        }}
        spacing={2}
        noValidate
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          hiddenLabel
          multiline
          minRows={1}
          fullWidth
          value={input}
          id="filled-hidden-label-small"
          placeholder={!preview ? "Let's chat" : ""}
          variant="filled"
          size="small"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            disableUnderline: true,
            startAdornment: preview && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column-reverse", // 👈 reverse to show image below text
                  width: "100%",
                }}
              >
                {file?.type.startsWith("image/") && (
                  <Box
                    component="img"
                    src={preview}
                    alt="Preview"
                    sx={{
                      width: imageWidth || 120,
                      height: imageHeight || 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ccc",
                      mt: 1,
                    }}
                  />
                )}

                {file?.type === "application/pdf" && (
                  <iframe
                    src={preview}
                    // alt="Preview"
                    style={{
                      width: imageWidth || 120,
                      height: imageHeight || 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ccc",
                      // mt: 1,
                    }}
                  />
                )}

                {(file?.type.startsWith("text/") ||
                  file?.name.endsWith(".csv")) && (
                  <pre
                    style={{
                      width: imageWidth || 120,
                      height: imageHeight || 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ccc",
                      // mt: 1,
                    }}
                  >
                    {preview}
                  </pre>
                )}

                {(file?.name.endsWith(".zip") ||
                  file?.name.endsWith(".xlsx")) && (
                  <Typography
                    // component="p"
                    // src={preview}
                    // alt="Preview"
                    sx={{
                      width: imageWidth || 120,
                      height: imageHeight || 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ccc",
                      mt: 1,
                    }}
                  >
                    {preview}
                  </Typography>
                )}
              </Box>
            ),
            sx: {
              alignItems: "flex-start",
              paddingTop: 1,
              paddingBottom: 1,
            },
            endAdornment: preview && (
              <InputAdornment position="end">
                <IconButton
                  onClick={removeFile}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  <HighlightOffRoundedIcon />
                  {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 1,
            // background: '#9facb7',
            borderRadius: "12px",
            "& .MuiFilledInput-root": {
              alignItems: "flex-start",
              flexDirection: "column-reverse", // necessary to allow custom stacking
              gap: 1,
              paddingY: 1,
            },
            "& .MuiInputBase-input": {
              padding: 1,
              boxSizing: "border-box",
              width: "100%",
            },
            "& .MuiInputAdornment-root": {
              position: "absolute",
              top: 5,
              right: 5,
            },
          }}
          disabled={!(userId && roomId)}
        />

        {/* Hidden file input */}
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Icon button to trigger input */}
        <IconButton
          color="primary"
          onClick={() => inputRef.current?.click()}
          sx={{
            width: 50,
            height: 50,
            // background:"#ecf6f6"
          }}
          disabled={!(userId && roomId)}
        >
          <AttachFileIcon sx={{ fontSize: 30 }} />
        </IconButton>

        <IconButton
          color="primary"
          onClick={sendMessage}
          sx={{
            width: 50,
            height: 50,
            // background:"#ecf6f6"
          }}
          disabled={!(userId && roomId)}
        >
          <SendRoundedIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <IconButton
          onClick={handleMedia}
          sx={{
            width: 50,
            height: 50,
            // background:"#ecf6f6"
          }}
          disabled={!(userId && roomId)}
        >
          <VideocamIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Chat;
