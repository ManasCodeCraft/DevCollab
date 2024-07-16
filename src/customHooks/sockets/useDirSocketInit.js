import { useDispatch, useSelector } from "react-redux";
import {
  addFile,
  addFolder,
  createNewProject,
  deleteDirectoryById,
  deleteFileById,
  deleteProjectById,
  removeCurrentProject,
  setDirectoryNewName,
  setFileContent,
  setFileNewName,
  setProjectNewName,
} from "../../redux/slices/projectSlice";
import { useEffect } from "react";
import { message } from "../../globalComponents/utilityModal";

export default function useSocketInit(socket) {
  const dispatch = useDispatch();
  const currDirectory = useSelector((state) => state.project.currentWorkingDirectory);
  const currentProject = useSelector((state) => state.project.currentProject);

  const handleDirOperations = ({ directory, data, type, target }) => {
    console.log('got here', directory, data, type, target);
    if (!currDirectory) {
      return;
    }
    if (directory != currDirectory.id) {
      return;
    }
    if (target === "project") {
      switch (type) {
        case "rename":
          dispatch(setProjectNewName(data));
          break;
        case "delete":
          if(currentProject.projectId === data){
             message('Project deleted', "Owner has deleted this project", dispatch)
             dispatch(deleteProjectById(data));
             dispatch(removeCurrentProject())
             return;
          }
          dispatch(deleteProjectById(data));
          break;
      }
    } else if (target === "file") {
      switch (type) {
        case "create":
          dispatch(addFile(data));
          break;
        case "rename":
          dispatch(setFileNewName(data));
          break;
        case "delete":
          dispatch(deleteFileById(data));
          break;
        case "update":
          dispatch(setFileContent(data));
      }
    } else if (target === "folder") {
      switch (type) {
        case "create":
          dispatch(addFolder(data));
          break;
        case "rename":
          dispatch(setDirectoryNewName(data));
          break;
        case "delete":
          dispatch(deleteDirectoryById(data));
          break;
      }
    }
  }

  useEffect(() => {
    if (!socket) return;
    socket.on("operation", handleDirOperations);

    return ()=>{
      socket.off("operation", handleDirOperations);
    }

  }, [socket, currDirectory, currentProject, handleDirOperations]);
}
