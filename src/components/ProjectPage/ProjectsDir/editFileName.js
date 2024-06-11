import React, { useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { message } from '../../../globalComponents/utilityModal';
import { setFileNewName } from '../../../redux/slices/projectSlice'; 

export default function EditFileNameModal({ file, show, handleClose }) {
  const newNameRef = useRef();
  const dispatch = useDispatch();

  async function editFileNameSubmit(e) {
    e.preventDefault();
    if (!newNameRef.current || !newNameRef.current.value) {
      return;
    }

    try {
      const response = await fetch('http://localhost:7000/file/edit-name', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: file.fileId,
          newName: newNameRef.current.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        message(response.status, errorData.message || 'Failed to edit name', dispatch);
        throw new Error(errorData.message || 'Unknown error occurred');
      }

      const data = await response.json();
      dispatch(setFileNewName({ id: file.fileId, newName: data })); 
      handleClose();
    } catch (err) {
      message('500', err.message || 'Unexpected error:', dispatch);
      console.log(err);
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={editFileNameSubmit}>
          <Form.Group controlId="FileNewName">
            <Form.Control
              type="text"
              placeholder="Enter New Name"
              name="FileNewName"
              ref={newNameRef}
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
  );
}
