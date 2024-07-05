import { useDispatch, useSelector } from "react-redux";
import { setRunningStatus } from "../../redux/slices/projectSlice";
import { useEffect } from "react";

export default function useRunningStatusInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }
    
    const handleRunningStatusChange = (data) => {
        dispatch(setRunningStatus(data));
    }

    socket.on('status-update', handleRunningStatusChange);

    return () => {
        socket.off('status-update', handleRunningStatusChange);
    };
  }, [socket]);
}
