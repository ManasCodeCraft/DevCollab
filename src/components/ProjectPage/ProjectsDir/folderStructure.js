import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dropdown, Button } from 'react-bootstrap'
import { getDirectory } from '../../../redux/api/projectAPI'
import EditDirectoryNameModal from './editFolderName'
import { confirmIt, message } from '../../../globalComponents/utilityModal'
import { deleteDirectoryById } from '../../../redux/slices/projectSlice'
export default function FolderStructure(props){
    const dispatch = useDispatch()
    const [editDirNameShow, setEditDirName]  = useState(false)
    const handleDirNameClose = ()=>{
        setEditDirName(false)
    }
    function openDirectory(){
         getDirectory(dispatch, props.dir.dirId)
    }

    function showDirNameEdit(){
       setEditDirName(true)
    }

    const handleDeleteDirectory = ()=>{
      confirmIt('Delete Directory', 'Are you sure you want to delete?', deleteDirectory, null, 'Delete', 'Close' ,'danger', dispatch)
  }

  function deleteDirectory() {
    fetch('http://localhost:7000/directory/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: props.dir.dirId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
            message(response.status, 'Failed to delete directory')
            throw new Error(response.message || 'An Error has occurred while deleting directory')
        }
        else{
            dispatch(deleteDirectoryById(props.dir.dirId))
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
        <div className="row my-2 dir-structure">
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title d-flex justify-content-between">
                            <span onClick={openDirectory}>
                              <img src="/icons/folder.png" alt="" srcset="" style={{width: '50px', height: '50px'}}/> {props.dir.dirName}
                              </span>
                            <Dropdown>
                                 <Dropdown.Toggle as={CustomToggle}>
                                         <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                 </Dropdown.Toggle>
                                 <Dropdown.Menu>
                                      <Dropdown.Item onClick={handleDeleteDirectory} >
                                        <ion-icon name="trash-outline"></ion-icon> Delete
                                      </Dropdown.Item>
                                      <Dropdown.Item onClick={showDirNameEdit}>
                                        <ion-icon name="pencil-outline"></ion-icon> Edit Name
                                      </Dropdown.Item>
                                 </Dropdown.Menu>
                            </Dropdown>
                        </h5>
                    </div>
                </div>
            </div>
        </div>
        <EditDirectoryNameModal directory={props.dir} show={editDirNameShow} handleClose={handleDirNameClose} />
        </>
    )
}