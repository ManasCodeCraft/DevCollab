import { useDispatch } from "react-redux";
 import { useEffect } from "react";
import { updateActiveCollab } from "../../redux/slices/projectSlice";

export default function useActiveCollabInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const updActiveCollab = (data) => {
        dispatch(updateActiveCollab(data));
    }

    socket.on('update-active-collab', updActiveCollab);

    return () => {
        socket.off('update-active-collab', updActiveCollab);
    };
  }, [socket]);
}
