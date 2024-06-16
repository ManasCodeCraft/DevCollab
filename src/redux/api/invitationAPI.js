import { setInvitations, setLoading, setError } from '../slices/invitationSlice'
export function getInvitations(dispatch){
     setLoading(true);
     fetch('/invitation/get-all',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
     }).then((response)=>{
         return response.json();
     }).then((data)=>{
         if(data){
             dispatch(setInvitations(data))
         }
         else{
            console.log('Error in fetching invitation..')
         }
     }).catch((error)=>{
         setLoading(false);
         setError(error.message);
         console.log(error);
     })

}