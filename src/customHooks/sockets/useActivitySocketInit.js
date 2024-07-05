import { useDispatch } from "react-redux";
import { addActivityLog } from "../../redux/slices/projectSlice";
import { useEffect } from "react";

export default function useActivitySocketInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleAddLog = (data) => {
      dispatch(addActivityLog(data));
    };

    socket.on("add-log", handleAddLog);

    return () => {
      socket.off("add-log", handleAddLog);
    };
  }, [socket, dispatch]);
}
