import React from 'react'
import { Container } from 'react-bootstrap'
import '../../../styles/logs.css';
import { useSelector } from 'react-redux';

export default function ErrorLogs() {
  const logs = useSelector(state=>state.project.currentProject.logs);
  return (
    <div className='error-logs-wrapper'>
        <Container fluid className="error-logs-window">
          {
            (logs)?
            (logs.Errorlogs).map((log)=>{
               return <p id={log.id}><span className='text-danger'>{log.time}</span> {log.value}</p>
            })
            : 
            ''
          }
        </Container>
    </div>
  )
}
