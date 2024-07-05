import { useDispatch, useSelector } from "react-redux";
import { updateActiveCollab } from "../../redux/slices/projectSlice";
import { useEffect } from "react";
import { pushMessage } from "../../redux/slices/chatSlice";

export default function useChatInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }
    const onMessaage = (data) => {
      console.log('rescived message', data);
      dispatch(pushMessage(data));
    }

    socket.on("message", onMessaage);

    return () => {
        socket.off("message", onMessaage);
    };
  }, [socket, dispatch]);
}
