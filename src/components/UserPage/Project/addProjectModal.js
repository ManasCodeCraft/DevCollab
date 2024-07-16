import React, { useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createNewProject } from '../../../redux/slices/projectSlice';
import { launchAutoCloseWaitingModal, setModalWaitingText, setWaitingCompleted, setWaitingModalProgress } from '../../../redux/slices/waitingModalSlice';
import { message } from '../../../globalComponents/utilityModal';
import useDirSocket from '../../../customHooks/sockets/useDirSocket';

export default function AddProjectModal({ show, handleClose }) {
  const dispatch = useDispatch();
  const baseURL = useSelector(state => state.config.baseURL);
  const socketOp = useDirSocket();
  const formRef = useRef(null);
  const inputRef = useRef(null);

  function addProjectSubmit(e) {
    e.preventDefault();
    dispatch(launchAutoCloseWaitingModal("Please wait... we are setting up your project"))
    const projectName = e.target.elements.projectName.value;
    fetch('/project/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectName }),
    })
      .then((response) => {
        dispatch(setWaitingCompleted());
        if (!response.ok) {
          throw new Error('Failed to create project');
        }
        if (response.status === 200 || response.status === 201) {
          handleClose();
        }
        return response.json();
      })
      .then((data) => {
        dispatch(createNewProject(data));
        socketOp({type: 'create', target: 'project', data: data, projectData: data})
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function uploadProject() {
    if (!formRef.current) {
      return;
    }
    handleClose(); 

    const files = inputRef.current.files;

    if (!files || files.length === 0) {
      message("Error", "Directory is empty", dispatch);
      return;
    }

    dispatch(launchAutoCloseWaitingModal("Uploading your project.. please wait"));

    // creating project 
    const projectName = files[0].webkitRelativePath.split('/')[0];
    const response = await fetch('/project/create-empty', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectName }),
    })
    const data = await response.json();
    dispatch(createNewProject(data));
    const project = data.projectId;
    const directory = data.rootDirectory;

    var filtered_files = Array.from(files).filter(file => file.webkitRelativePath.indexOf('node_modules/') == -1);

    for(let file of filtered_files){
      const rPath = file.webkitRelativePath;
      file.relativePath = rPath.slice(rPath.indexOf('/')+1);
    }

    var totalFiles = filtered_files.length;
    var filesUploading = [];
    const incProgress = ()=>{
       let progress = (filesUploading.length/totalFiles)*100;
       let currentFile = filesUploading[filesUploading.length-1];
       dispatch(setWaitingModalProgress(progress))
       dispatch(setModalWaitingText(`Uploading ${filesUploading.length} of ${totalFiles} (${currentFile.name})`))
    }

    dispatch(setWaitingModalProgress(0))

    // uploading files

    for (let file of filtered_files) {
      filesUploading.push(file);
      incProgress();

      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('relativePath', file.relativePath);
      fileData.append('project', project);
      fileData.append('directory', directory);

      try {
        const response = await fetch(`${baseURL}/file/upload-path`, {
          method: 'POST',
          credentials: 'include',
          body: fileData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file: ' + file.webkitRelativePath);
        }
      } catch (error) {
        console.error(error);
        message("Error", "Failed to upload some files", dispatch);
        break;
      }

    }

    dispatch(setWaitingCompleted());
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addProjectSubmit}>
          <Form.Group controlId="projectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Project Name"
              name="projectName"
            />
          </Form.Group>
          <div className="button-wrapper d-flex justify-content-center align-items-center my-3">
            <Button variant="primary" type="submit">
              Create Empty Project
            </Button>
          </div>
        </Form>

        <div className="divider-section my-3">
          <div className="left-border"></div>
          <span>Or</span>
          <div className="right-border"></div>
        </div>

        <div className="button-wrapper d-flex justify-content-center align-items-center my-3">
          <Button variant="success" onClick={() => { inputRef.current.click(); }}>Upload from local</Button>
        </div>

        <form action={`${baseURL}/project/upload`} method="POST" encType="multipart/form-data" ref={formRef} style={{ display: 'none' }}>
          <input type="file" name="files" multiple webkitdirectory="true" directory="true" ref={inputRef} onChange={uploadProject} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
