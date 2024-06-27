import { useDispatch } from "react-redux";
import { addFile, addFolder, createNewProject, deleteDirectoryById, deleteFileById, deleteProjectById, setDirectoryNewName, setFileNewName, setProjectNewName } from "../../redux/slices/projectSlice";

export default function useSocketInit(socket) {
  const dispatch = useDispatch();

  if(!socket) return;

  socket.on("operation", ({ data, type, target}) => {
    if (target === "project") {
      switch (type) {
        case "create":
          dispatch(createNewProject(data));
          break;
        case "rename":
          dispatch(setProjectNewName(data))
          break;
        case "delete":
          dispatch(deleteProjectById(data))
          break;
      }
    }
    else if (target === "file") {
      switch (type) {
        case "create":
          dispatch(addFile(data));
          break;
        case "rename":
          dispatch(setFileNewName(data))
          break;
        case "delete":
          dispatch(deleteFileById(data))
          break;
      }
    } 
    else if (target === "folder") {
      switch (type) {
        case "create":
          dispatch(addFolder(data));
          break;
        case "rename":
          dispatch(setDirectoryNewName(data))
          break;
        case "delete":
          dispatch(deleteDirectoryById(data))
          break;
      }
    } 
  });

}
