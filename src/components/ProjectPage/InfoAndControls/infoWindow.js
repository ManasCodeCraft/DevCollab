import React from 'react'
import { useSelector } from 'react-redux';

export default function InfoWindow() {
  const project = useSelector(state=>state.project.currentProject);
  if(!project){
    return null;
  }

  return (
      (project.isDeployed)? 
      <div className='info-window-wrapper'>
      <div className="info-window">
              <span id='memory-usage'>
                  <strong>Today Traffic: </strong><span>{project.todayReq}</span>
              </span>
              <span id='cpu-usage'>
                  <strong>This Month Traffic: </strong><span>{project.thisMonthReq}</span>
              </span>
          </div>
      </div>
  : 
     null
  )
}
