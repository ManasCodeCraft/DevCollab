import { useDispatch, useSelector } from "react-redux";
import { addActivityLog, addNewCollab, deleteProjectById, removeCurrentProject } from "../../redux/slices/projectSlice";
import { useEffect } from "react";
import { pushInvitation } from "../../redux/slices/invitationSlice";
import { message } from "../../globalComponents/utilityModal";

export default function useInviteSocketInit(socket) {
  const dispatch = useDispatch();
  const currentProject = useSelector(state=>state.project.currentProject);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const receiveInvite = (data) => {
        dispatch(pushInvitation(data));
    }
    const joinNewCollab = (data) => {
        dispatch(addNewCollab(data));
    }

    const deleteCollaborator = (data)=>{
        dispatch(deleteProjectById(data.projectId));
        if(currentProject.projectId === data.projectId){
            message("You are removed", "You have been removed from this project by owner", dispatch)
            dispatch(removeCurrentProject())
            return;
        }
    }

    socket.on("invite", receiveInvite);
    socket.on("collab", joinNewCollab);
    socket.on("delete-collab", deleteCollaborator);

    return () => {
      socket.off("invite", receiveInvite);
      socket.off("collab", joinNewCollab);
      socket.off("delete-collab", deleteCollaborator);
    };
  }, [socket, dispatch]);
}
