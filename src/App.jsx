import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from './components/Home/HomePage';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthForm from './components/Auth/authForm';
import UserPage from './components/UserPage/userPage';
import ProjectPage from './components/ProjectPage/projectPage';
import { useEffect } from 'react';
import { UserAuthenication } from './redux/api/authAPI';
import { getAllProjects } from './redux/api/projectAPI';
import { useDispatch, useSelector } from 'react-redux'
import { getInvitations } from './redux/api/invitationAPI';
import { ConfirmationModal, MessageModal, WaitingModal, message } from './globalComponents/utilityModal';

function App() {
  const dispatch = useDispatch();
  const dark = useSelector(state=>state.config.darkMode);

  useEffect(()=>{
    const queryParams = new URLSearchParams(window.location.search); 
    const error = queryParams.get('error'); 
    if(error){
       message('Error', error, dispatch)
    }
  }, [])

  useEffect(()=>{
     UserAuthenication(dispatch);
     getAllProjects(dispatch); 
     getInvitations(dispatch)
  }, [])

  useEffect(()=>{
    document.body.setAttribute('data-bs-theme', (dark)?'dark':'light');
  }, [dark])

  return (
    <BrowserRouter>
       <MessageModal/>
       <ConfirmationModal/>
       <WaitingModal/>
       <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/auth/*' element={<AuthForm/>}/>
          <Route path='/user/*' element={<UserPage/>} />
          <Route path='/project/*' element={<ProjectPage/>} />
       </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
