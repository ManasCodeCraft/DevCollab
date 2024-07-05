import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import ActiveCollaborators from './activeCollaborators';

export default function InfoWindow() {
  const [show, setShow] = useState(false);
  const hideModal = () => {
    setShow(false);
  };
  const showModal = () => {
    setShow(true);
  }

  const project = useSelector(state=>state.project.currentProject);

  if(!project){
    return null;
  }
  const activeCollab = project.activeCollaborators;
  if(!activeCollab){
     return null;
  }
  return (
      <div className='info-window-wrapper'>
      <div className="info-window">
              <span>
                  <strong>Active Collaborators: </strong><span>{activeCollab.length}</span>
              </span>
              <span className='mx-auto'>
                   <Button variant='info' onClick={showModal}>Check</Button>
              </span>
              <ActiveCollaborators collaborators={activeCollab} show={show} hideModal={hideModal}/>
          </div>
      </div>
  )
}
