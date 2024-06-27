import React from 'react'
import { Container } from 'react-bootstrap'
import '../../../styles/activityLog.css'
import { useSelector } from 'react-redux'
import ActivityLogStructure from './activityLogStructure'

export default function ActivityLogs() {
  const project = useSelector(state=>state.project.currentProject);
  if(!project) {
    return null;
  }

  const activityLogs = project.activityLogs;
  if(!activityLogs) {
    return null;
  }

  console.log(activityLogs)
  
  return (
    <Container className='activity-log-container'>
      { 
        activityLogs.map((log)=>{
          return <ActivityLogStructure log={log} />
        })
      }
    </Container>
  )
}
