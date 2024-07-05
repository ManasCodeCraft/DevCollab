import { useDispatch } from "react-redux";
import { launchAutoCloseWaitingModal, setModalWaitingText, setWaitingCompleted } from '../../redux/slices/waitingModalSlice'
import { useEffect } from "react";

export default function useWaitingModalInit(socket) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      return;
    }
    
    const handleLaunchModal = (text) => {
        dispatch(launchAutoCloseWaitingModal(text))
    }

    const handleCloseModal = () => {
        dispatch(setWaitingCompleted());
    }

    const handleChangeText = (text) => {
        dispatch(setModalWaitingText(text))
    }

    socket.on('launch-modal', handleLaunchModal)
    socket.on('close-modal', handleCloseModal)
    socket.on('change-text', handleChangeText)

    return () => {
        socket.off('launch-modal', handleLaunchModal)
        socket.off('close-modal', handleCloseModal)
        socket.off('change-text', handleChangeText)
    };
  }, [socket]);
}
