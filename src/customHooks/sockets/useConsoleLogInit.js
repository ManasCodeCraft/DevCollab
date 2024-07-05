import { useDispatch, useSelector } from "react-redux";
import { pushConsoleLog } from "../../redux/slices/projectSlice";
import { useEffect } from "react";

export default function useConsoleLogInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleConsoleLog = (data) => {
      console.log('Received console log:', data);  // Simulate logging to the console.
        dispatch(pushConsoleLog(data))
    }
    socket.on('console-log', handleConsoleLog)

    return () => {
        socket.off('console-log', handleConsoleLog)
    };
  }, [socket, dispatch]);
}
