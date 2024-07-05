import React, { useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { message } from '../../../globalComponents/utilityModal';
import { setProjectNewName } from '../../../redux/slices/projectSlice';
import useDirSocket from '../../../customHooks/sockets/useDirSocket';

export default function EditNameModal({project, show, handleClose}) {
  const newNameref = useRef()
  const dispatch = useDispatch()
  const socketOp = useDirSocket();

  function editProjectNameSubmit(e) {
    e.preventDefault();
    if(!newNameref.current && !newNameref.current.value){
        return;
    }
    fetch('/project/edit-name', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: project.projectId,
        name: newNameref.current.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
             message(response.status, 'Failed to edit name', dispatch)
             throw new Error(response.message)
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setProjectNewName({id: project.projectId, newName: data}))     
        socketOp({type: 'rename', target: 'project', data: {id: project.projectId, newName: data}})
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editProjectNameSubmit}>
            <Form.Group controlId="projectNewName">
              <Form.Control
                type="text"
                placeholder="Enter New Name"
                name="projectNewName"
                ref={newNameref}
              />
            </Form.Group>
            <div className="button-wrapper d-flex justify-content-center align-items-center my-3">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
