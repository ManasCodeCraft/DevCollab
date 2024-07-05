import { useSelector } from "react-redux";

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

  const user = useSelector((state) => state.auth.user);

  var id = 0;

  function send(detail) {
    const data = {
      name: user.username,
      time: getCurrentTime(),
      text: detail.message,
      self: false,
      id: id++,
    };
    detail.message = data;
    detail.userId = user.userid;

    socket.emit("send-message", detail);
    data.self = true;
    return data;
  }

  return send;
}
