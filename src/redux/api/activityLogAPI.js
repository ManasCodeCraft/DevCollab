import { setActivityLogs } from "../slices/projectSlice";

export default async function fetchActivityLogs(projectId ,dispatch){
    const response = await fetch(`/project/get-activity-logs`,{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectId: projectId
        })
    })
    const data = await response.json();
    dispatch(setActivityLogs({id: projectId, logs: data}));
}