import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { message } from "../../../globalComponents/utilityModal"
import { useDispatch, useSelector } from "react-redux";
import { launchAutoCloseWaitingModal, setWaitingCompleted } from "../../../redux/slices/waitingModalSlice";

export default function NpmInstallModal({show, handleClose}) {
  const project = useSelector(state=>state.project.currentProject)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
     e.preventDefault();
     handleClose();
     dispatch(launchAutoCloseWaitingModal("Installing Package... Please wait..."))
     const response = await fetch('exec/run-nodejs/nodejs-package', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ packageName: e.target.packageName.value, projectId: project.projectId }),
     })

     dispatch(setWaitingCompleted());

     if(!response.ok){
        message("Error", "Failed to install package: " + e.target.packageName.value, dispatch);
     }
  }

  const npmInstallRun = async (e) => {
    e.preventDefault();
    handleClose();
    dispatch(launchAutoCloseWaitingModal("Running npm install... Please wait..."))
    const response = await fetch('exec/run-nodejs/npm-install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId: project.projectId }),
    })

    dispatch(setWaitingCompleted());
    
    if(!response.ok){
       message("Error", "Failed to run npm install: " + response.statusText, dispatch);
    }

  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="packageName">
            <Form.Label>Package Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter package Name"
              name="packageName"
            />
          </Form.Group>
          <div className="button-wrapper d-flex justify-content-center align-items-center my-3">
            <Button variant="primary" type="submit">
               Install
            </Button>
          </div>
        </Form>

        <div className="divider-section my-3">
          <div className="left-border"></div>
          <span>Or</span>
          <div className="right-border"></div>
        </div>

        <div className="button-wrapper d-flex justify-content-center align-items-center my-3">
          <Button
            variant="success"
            onClick={npmInstallRun}
          >
            Install from package.json
          </Button>
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
