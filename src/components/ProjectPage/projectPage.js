import React from 'react'
import ProjectStructure from './ProjectsDir/projectStructure'
import { NavLink, Routes, Route } from 'react-router-dom'
import '../../styles/projectPage.css'
import Collaborators from './Collaborators/collaborators'
import ChatRoom from './chatRoom'
import CodeEditor from './codeEditor'
import { useSelector } from 'react-redux'
import ConsoleLogs from './Logs/consoleLogs'
import ErrorLogs from './Logs/errorLogs'
import InfoAndControls from './InfoAndControls/infoAndControls'
import Navbar from '../../globalComponents/navbar'

export default function ProjectPage() {
  const currentfile = useSelector(state=>state.project.currentlyOpenedFile)
  const project = useSelector(state=>state.project.currentProject);
  return (
    <>
      <Navbar/>
      <InfoAndControls/>
      <div className="my-1 fs-4 border-bottom project-nav nav">
        <NavLink to={(currentfile)?'/project/structure/editor':'/project/structure'} className='mx-2 nav-item'>Project</NavLink>
        {
          (project && project.isDeployed)?
          <>
            <NavLink to='/project/console-logs' className='mx-2 nav-item' >Console Logs</NavLink>
            <NavLink to='/project/error-logs' className='mx-2 nav-item' >Error Logs</NavLink>
          </>
          :
          null
        }

        <NavLink to='/project/collaborators' className='mx-2 nav-item'>Collaborators</NavLink>
      </div>

      <Routes>
        <Route path='/structure'>
               <Route path='' element={<ProjectStructure/>} />   
               <Route path='editor' element={<CodeEditor/>} />
        </Route>
        <Route path='/collaborators' element={<Collaborators/>} />
        <Route path='/console-logs' element={<ConsoleLogs/>} />
        <Route path='/error-logs' element={<ErrorLogs/>} />
      </Routes>

    </>
  )
}
