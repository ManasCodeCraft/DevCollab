import { setUser, setLoading, setError, logout, setUserInfo } from '../slices/authSlice'
import { screenBlockLoading, screenBlockLoadingClose } from '../slices/screenBlockLoadingSlice';
export function UserAuthenication(dispatch){
     dispatch(screenBlockLoading("Please wait.. Checking your credentials"))
     fetch('http://localhost:7000/auth/user-authenication',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
     }).then((response)=>{
         dispatch(screenBlockLoadingClose())
         return response.json();
     }).then((data)=>{
         if(data.user){
             let dispatch_user_action = {
                 userid: data.user.id,
                 username: data.user.UserName,
                 profilePic: data.user.ProfilePic,
             }
             dispatch(setUser(dispatch_user_action));
         }
     }).catch((error)=>{
         console.log(error);
     })

}