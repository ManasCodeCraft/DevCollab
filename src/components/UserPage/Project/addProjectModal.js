import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createNewProject } from '../../../redux/slices/projectSlice';

export default function AddProjectModal({ show, handleClose }) {
  const dispatch = useDispatch();
  function addProjectSubmit(e) {
    e.preventDefault();
    const projectName = e.target.elements.projectName.value;
    fetch('http://localhost:7000/project/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName: projectName,
      }),
    })
      .then((response) => {
        if(!response.ok){
           throw new Error('Failed to create project')
        }
        if (response.status === 200 || response.status === 201) {
            handleClose()
        }
        return response.json();
      })
      .then((data) => {
          dispatch(createNewProject(data))
      })
      .catch((error) => {
        console.log(error);
      });
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
          <Button variant="success">Import from Github</Button>
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
