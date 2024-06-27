import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pushMessage } from "../../redux/slices/chatSlice";

function getCurrentTime() {
  const date = new Date();
  const time24hr = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return time24hr;
}

export default function useChat(socket) {
  const project = useSelector((state) => state.project.currentProject);
  if (!project) {
    window.location.href = "/user/projects";
  }

  const userId = useSelector((state) => state.auth.user.userid);
  const username = useSelector((state) => state.auth.user.username);
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        dispatch(pushMessage(data));
      });
    }
  }, [socket]);

  if (!socket) {
    return null;
  }

  const projectId = project.projectId;
  const collaborators = project.collaborators.map((coll) => coll.id);
  socket.emit("register", { projectId, collaborators, userId });

  var id = 0;

  function send(message) {
    const data = {
      name: username,
      time: getCurrentTime(),
      text: message,
      self: false,
      id: id++,
    };
    socket.emit("message", { message: data, userId, projectId });
    data.self = true;
    return data;
  }

  return send;
}
