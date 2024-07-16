import { useDispatch, useSelector } from "react-redux";
import { addLogToCurrentlyExecutingFile, pushConsoleLog } from "../../redux/slices/projectSlice";
import { useEffect } from "react";

export default function useConsoleLogInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleConsoleLog = (data) => {
        dispatch(pushConsoleLog(data))
    }

    const handleProgramLog = (data) => {
        dispatch(addLogToCurrentlyExecutingFile(data))
    }

    socket.on('console-log', handleConsoleLog)
    socket.on('program-log', handleProgramLog)

    return () => {
        socket.off('console-log', handleConsoleLog)
        socket.off('program-log', handleProgramLog)
    };
  }, [socket, dispatch]);
}
