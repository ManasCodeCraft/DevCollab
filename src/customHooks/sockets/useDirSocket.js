import { useSelector } from "react-redux";
import { getDirSocket } from "../../websocketInit";

export default function useDirSocket(){
    const socket = getDirSocket();
    const userId = useSelector(state=>state.auth.user.userid);
    const project = useSelector(state=>state.project.currentProject);
    const currentDir = useSelector(state=>state.project.currentWorkingDirectory);

    function operate(details){
        const type = details.type;
        const target = details.target;
        const data = details.data;
        const projectData = details.projectData;

        var collaborators;
        if(projectData){
            collaborators = projectData.collaborators.map(coll=>coll.id);
        }else{
            collaborators = project.collaborators.map(coll=>coll.id);
        }
        const detail = {
            directory: currentDir.id,
            userId,
            collaborators,
            type,
            target,
            data
        }
        socket.emit('operation', detail)
    }

    return operate;
}