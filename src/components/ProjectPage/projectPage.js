import React, {useState, useEffect} from 'react'
import ProjectStructure from './ProjectsDir/projectStructure'
import { NavLink, Routes, Route } from 'react-router-dom'
import '../../styles/projectPage.css'
import Collaborators from './Collaborators/collaborators'
import ChatRoom from './chatRoom'
import ActivityLogs from './ActivityLogs/activityLogs'
import { useSelector } from 'react-redux'
import ConsoleLogs from './Logs/consoleLogs'
import ErrorLogs from './Logs/errorLogs'
import InfoAndControls from './InfoAndControls/infoAndControls'
import Navbar from '../../globalComponents/navbar'
import Editor from './CodeEditor/index'
import useChat from '../../customHooks/sockets/useChat'
import socketIOClient from 'socket.io-client';

export default function ProjectPage() {
  const currentfile = useSelector(state=>state.project.currentlyOpenedFile)
  const project = useSelector(state=>state.project.currentProject);
  const [socket, setSocket] = useState(null);
  let baseURL = useSelector(state=>state.config.baseURL);
  baseURL += '/chat-socket'

  useEffect(()=>{
    if(baseURL){
      const socket = socketIOClient(baseURL);
      setSocket(socket);
    }
  }, [baseURL])

  const sendMessage = useChat(socket);

  return (
    <>
      <Navbar/>
      <InfoAndControls/>
      <div className="my-1 fs-4 border-bottom project-nav nav">
        <NavLink to={(currentfile)?'/project/structure/editor':'/project/structure'} className='mx-2 nav-item'>Project</NavLink>
        {
          (project)?
          <>
            <NavLink to='/project/console-logs' className='mx-2 nav-item' >Console Logs</NavLink>
            {/* <NavLink to='/project/error-logs' className='mx-2 nav-item' >Error Logs</NavLink> */}
          </>
          :
          null
        }
        <NavLink to='/project/chat-room' className='mx-2 nav-item'>Chat Room</NavLink>
        <NavLink to='/project/activity-logs' className='mx-2 nav-item'>Activity Logs</NavLink>
        <NavLink to='/project/collaborators' className='mx-2 nav-item'>Collaborators</NavLink>
      </div>

      <Routes>
        <Route path='/structure'>
               <Route path='' element={<ProjectStructure/>} />   
               <Route path='editor' element={<Editor/>} />
        </Route>
        <Route path='/collaborators' element={<Collaborators/>} />
        <Route path='/activity-logs' element={<ActivityLogs/>} />
        <Route path='/console-logs' element={<ConsoleLogs/>} />
        <Route path='/error-logs' element={<ErrorLogs/>} />
        <Route path='/chat-room' element={<ChatRoom sendMessage={sendMessage} />} />
      </Routes>

    </>
  )
}
