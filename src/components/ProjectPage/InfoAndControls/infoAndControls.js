import React from 'react'
import { Alert } from 'react-bootstrap';
import '../../../styles/infoAndControls.css';
import InfoWindow from './infoWindow';
import ControlsWindow from './controlsWindow';
import { useSelector } from 'react-redux';

export default function InfoAndControls() {
  const project = useSelector(state=>state.project.currentProject)
  if(!project){
    window.location.href = '/user/projects';
    return null;
  }
  return (
    <>
    <div className="d-flex justify-content-between">
        <InfoWindow/>
        <ControlsWindow/>
    </div>

    {
      (project.isRunning)? 
      <Alert variant="info" dismissible>
      <div className="d-flex align-items-center">
          <span>
              Your website is live at <a href={project.url} target='_blank'>{project.url}</a>
          </span>
      </div>
      </Alert> 
      :
      null
    }

    </>
  )
}
