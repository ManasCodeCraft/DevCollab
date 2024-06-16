import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { addFile, addFolder } from '../../../redux/slices/projectSlice';
import { launchAutoCloseWaitingModal, setWaitingCompleted } from '../../../redux/slices/waitingModalSlice';

export function AddFileFolderButton({handleShow}) {
    return (
        <div className="create-project-button m-5">
            <Button
                variant="primary"
                size="lg"
                onClick={handleShow}
            >
                Add File/Folder 
            </Button>
        </div>
    );
}

export default function AddFileFolderModal(props) {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const uploadform = useRef(null);
    const projectId = useSelector(state => state.project.currentWorkingDirectory.projectId);
    const parentDirectoryId = useSelector(state => state.project.currentWorkingDirectory.id);

    function uploadFile(){
        if(!uploadform.current){
            return;
        }
        const formData = new FormData(uploadform.current);
        if(projectId){
            formData.append('projectId', projectId);
        }
        if(parentDirectoryId){
            formData.append('parentDirectoryId', parentDirectoryId);
        }
        dispatch(launchAutoCloseWaitingModal('Uploading file ...'))
        props.handleClose();
        fetch('/file/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then((response) => {
            if(!response.ok){
                throw new Error('An Error has occurred')
            }
            return response.json();
        }).then((data) => { 
            dispatch(addFile(data))
            dispatch(setWaitingCompleted())
        }).catch((error) => {
            console.log(error);
            dispatch(setWaitingCompleted())
        });
    }

    function addFileSubmit(e) {
        e.preventDefault();
        const FileName = e.target.querySelector('#FileName');
        props.handleClose()
        fetch('/file/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: FileName.value,
                projectId: props.projectId,
                parentDirectoryId: props.parentDirectoryId
            })
        }).then((response) => {
            if(!response.ok){
                 throw new Error('An Error has occurred')
            }
            return response.json();
        }).then((data) => {
            dispatch(addFile(data))
        }).catch((error) => {
            console.log(error);
        });
    }

    function addFolderSubmit(e) {
        e.preventDefault();
        const FolderName = e.target.querySelector('#FolderName');
        fetch('/directory/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: FolderName.value,
                projectId: props.projectId,
                parentDirectoryId: props.parentDirectoryId
            })
        }).then((response) => {
            if (response.status === 200 || response.status === 201) {
                 props.handleClose()
            }
            return response.json();
        }).then((data) => {
             dispatch(addFolder(data))
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <Modal
            show={props.show}
            id="addFileFolderModal"
            centered
            aria-labelledby="addFileFolderModalLabel"
            aria-hidden="true"
            onHide={props.handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title className="text-center fw-bold" id="addFileFolderModalLabel">
                    Add File or Folder
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={addFolderSubmit}>
                    <Form.Group controlId="FolderName">
                        <Form.Label>Folder Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Folder Name" />
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center my-3">
                        <Button type="submit" variant="primary">
                            Create Empty Folder
                        </Button>
                    </div>
                </Form>

                <div className="divider-section my-3 d-flex justify-content-center align-items-center">
                    <div className="left-border"></div>
                    <span>Or</span>
                    <div className="right-border"></div>
                </div>

                <Form onSubmit={addFileSubmit}>
                    <Form.Group controlId="FileName">
                        <Form.Label>File Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter File Name" />
                    </Form.Group>
                    <div className="d-flex justify-content-center align-items-center my-3">
                        <Button type="submit" variant="primary">
                            Create Empty File
                        </Button>
                    </div>
                </Form>

                <div className="divider-section my-3 d-flex justify-content-center align-items-center">
                    <div className="left-border"></div>
                    <span>Or</span>
                    <div className="right-border"></div>
                </div>

                <div className="d-flex justify-content-center align-items-center my-3">
                    <Button type="button" variant="success" className="upload-file-btn" onClick={()=>{fileInputRef.current.click()}}>
                        Upload File
                    </Button>
                </div>

                <Form id="file-upload-form" style={{ display: 'none' }} encType="multipart/form-data" ref={uploadform}>
                    <Form.Control type="file" name="file" ref={fileInputRef} onChange={uploadFile} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
