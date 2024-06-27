import { useDispatch } from "react-redux";
import { addActivityLog } from "../../redux/slices/projectSlice";

export default function useActivitySocketInit(socket) {
  const dispatch = useDispatch();

  if(!socket){
    return null;
  }

  socket.on("add-log", (data)=>{
    dispatch(addActivityLog(data))
  })
}
