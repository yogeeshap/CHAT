import { useParams } from "react-router-dom";
import MediaController from "../chat/mediaController";

const MediaControllerWrapper = () => {
  
  const { roomId, userId } = useParams();
  console.log(roomId,userId,'userId')

  if (!roomId || !userId) return <div>Missing data</div>;

  return <MediaController roomId={roomId} userId={userId} />;
};

export default MediaControllerWrapper;
