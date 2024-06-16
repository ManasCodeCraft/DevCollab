import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import EditNameModal from './editNameModal';
import { useDispatch } from 'react-redux';
import { deleteProjectById, popAllDirStack, pushDirStack, setCurrentProject, setProjectLogs } from '../../../redux/slices/projectSlice';
import { Dropdown, Card } from 'react-bootstrap';
import { confirmIt, message } from '../../../globalComponents/utilityModal';
import { getDirectory } from '../../../redux/api/projectAPI';
import { screenBlockLoading, screenBlockLoadingClose } from '../../../redux/slices/screenBlockLoadingSlice';

export default function ProjectBody(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editShow, setEditShow] = useState(false)
  const handleEditNameModal = ()=>{
      setEditShow(true)
  }

  const handleEditClose = ()=>{
    setEditShow(false)
  }

  const handleDeleteProject = ()=>{
      confirmIt('Delete Project', 'Are you sure you want to delete?', deleteProject, null, 'Delete', 'Close' ,'danger', dispatch)
  }

  function deleteProject() {
    fetch('/project/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: props.project.projectId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
            message(response.status, 'Failed to delete project', dispatch)
            throw new Error(response.message || 'An Error has occurred while deleting project')
        }
        else{
            dispatch(deleteProjectById(props.project.projectId))
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getLogsDetails(){
    if(!props.project.isDeployed){
        return;
    }
    fetch('/host/logs', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         projectId : props.project.projectId
      }),
    })
     .then((response) => {
        if (!response.ok) {
            throw new Error(response.message || 'An Error has occurred while getting logs')
        }
        else{
            return response.json()
        }
      })
     .then((data) => {
         dispatch(setProjectLogs({id: props.project.projectId, logs: data}))
      })
     .catch((err) => {
        console.log(err);
      });
  }

  async function openProject() {
    dispatch(screenBlockLoading("Loading your projects... Please wait"))
    dispatch(popAllDirStack());
    dispatch(setCurrentProject(props.project));
    await getDirectory(dispatch, props.project.rootDirectory)
    getLogsDetails();
    dispatch(screenBlockLoadingClose())
    navigate('/project/structure');
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  ));

  return (
    <>
    <div className="row my-2 project-body">
      <div className="col-md-12">
        <Card>
          <Card.Body>
            <h5 className="card-title d-flex justify-content-between">
              <span onClick={openProject}>{props.project.projectName}</span>
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                  <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleDeleteProject}>
                     <ion-icon name="trash-outline"></ion-icon> Delete Project
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleEditNameModal} >
                    <ion-icon name="pencil-outline"></ion-icon> Edit Name
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <ion-icon name="download-outline"></ion-icon> Export Project
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </h5>
            <p className="card-text">{props.project.description}</p>
          </Card.Body>
          <Card.Footer>
               {
                (props.project.isDeployed) ?
                   ( props.project.isRunning? <span className="fs-6 float-left text-success">Running</span>
                   : <span className="fs-6 float-left text-danger">Not Running</span> )
                   :
                   <span className="fs-6 float-left text-secondary">Not Deployed</span>
               }
          </Card.Footer>
        </Card>
      </div>
    </div>

    <EditNameModal show={editShow} handleClose={handleEditClose} project={props.project} />
    </>
  );
}
