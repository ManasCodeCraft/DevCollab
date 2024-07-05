import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Card, Dropdown } from 'react-bootstrap';
import { setCurrentlyOpenedFile } from '../../../redux/slices/projectSlice';
import EditFileNameModal from './editFileName'; 
import { confirmIt, message } from '../../../globalComponents/utilityModal';
import { deleteFileById } from '../../../redux/slices/projectSlice'; 
import useDirSocket from '../../../customHooks/sockets/useDirSocket';

export default function FileStructure(props) {
    const navigate = useNavigate();
    const socketOp = useDirSocket();
    const dispatch = useDispatch();
    const [editFileNameShow, setEditFileNameShow] = useState(false);

    const handleFileNameClose = () => {
        setEditFileNameShow(false);
    };

    function openFile() {
        console.log(props.file);
        if (props.file.fileType === 'String') {
            dispatch(setCurrentlyOpenedFile(props.file));
            navigate('/project/structure/editor');
        } else if (props.file.fileType === 'Binary') {
            window.open(props.file.fileUrl, '_blank');
        }
    }

    const handleDeleteFile = () => {
        confirmIt(
            'Delete File',
            'Are you sure you want to delete?',
            deleteFile,
            null,
            'Delete',
            'Close',
            'danger',
            dispatch
        );
    };

    function deleteFile() {
        fetch('/file/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                id: props.file.fileId,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    message(response.status, 'Failed to delete file');
                    throw new Error(response.message || 'An error occurred while deleting file');
                } else {
                    dispatch(deleteFileById(props.file.fileId)); // Ensure this action exists
                    socketOp({type: 'delete', target: 'file', data: props.file.fileId})
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fileName = props.file.fileName
    const fileExt = fileName.split('.')[fileName.split('.').length - 1]

    return (
        <>
            <div className="row my-2 dir-structure">
                <div className="col-md-12">
                    <Card>
                        <Card.Body>
                            <h5 className="card-title d-flex justify-content-between">
                                <span onClick={openFile} style={{ cursor: 'pointer' }}>
                                    <img src={`/icons/${fileExt}.png`} alt="" srcset="" onError={(e)=>{e.target.src='/icons/file.png'}} style={{width: '50px', height: '50px'}}/> {fileName}
                                </span>
                                <Dropdown>
                                    <Dropdown.Toggle as='span'>
                                        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleDeleteFile}>
                                          <ion-icon name="trash-outline"></ion-icon> Delete
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setEditFileNameShow(true)}>
                                          <ion-icon name="pencil-outline"></ion-icon> Edit Name
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </h5>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <EditFileNameModal file={props.file} show={editFileNameShow} handleClose={handleFileNameClose} />
        </>
    );
}
