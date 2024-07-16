import { useDispatch, useSelector } from "react-redux";
import { setRunningStatus, updateProgramStatus } from "../../redux/slices/projectSlice";
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

    const handleProgramRunningStatus = (data) => {
       dispatch(updateProgramStatus(data));
    }

    socket.on('status-update', handleRunningStatusChange);
    socket.on('program-status-update', handleProgramRunningStatus);

    return () => {
        socket.off('status-update', handleRunningStatusChange);
        socket.off('program-status-update', handleProgramRunningStatus);
    };
  }, [socket]);
}
