import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { addFile, addFolder } from "../../../redux/slices/projectSlice";
import {
  launchAutoCloseWaitingModal,
  setModalWaitingText,
  setWaitingCompleted,
  setWaitingModalProgress,
} from "../../../redux/slices/waitingModalSlice";
import useDirSocket from "../../../customHooks/sockets/useDirSocket";
import { message } from "../../../globalComponents/utilityModal";
import { refreshDirectory } from "../../../redux/api/projectAPI";

export function AddFileFolderButton({ handleShow }) {
  return (
    <div className="create-project-button m-5">
      <Button variant="primary" size="lg" onClick={handleShow}>
        Add File/Folder
      </Button>
    </div>
  );
}

export default function AddFileFolderModal({
  show,
  handleClose,
  projectId,
  parentDirectoryId,
}) {
  const dispatch = useDispatch();
  const socketOp = useDirSocket();
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const uploadform = useRef(null);
  const dirStack = useSelector((state) => state.project.dirStack);

  function uploadFile() {
    if (!uploadform.current) {
      return;
    }
    const formData = new FormData(uploadform.current);
    if (projectId) {
      formData.append("projectId", projectId);
    }
    if (parentDirectoryId) {
      formData.append("parentDirectoryId", parentDirectoryId);
    }
    dispatch(launchAutoCloseWaitingModal("Uploading file ..."));
    handleClose();
    fetch("/file/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("An Error has occurred");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(addFile(data));
        socketOp({ type: "create", target: "file", data: data });
        dispatch(setWaitingCompleted());
      })
      .catch((error) => {
        console.log(error);
        dispatch(setWaitingCompleted());
      });
  }

  function addFileSubmit(e) {
    e.preventDefault();
    const FileName = e.target.querySelector("#FileName");
    handleClose();
    fetch("/file/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: FileName.value,
        projectId: projectId,
        parentDirectoryId: parentDirectoryId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("An Error has occurred");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(addFile(data));
        socketOp({ type: "create", target: "file", data: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function uploadFolder() {
    if (!folderInputRef.current) {
      return;
    }
    handleClose();

    const files = folderInputRef.current.files;

    if (!files || files.length === 0) {
      message("Error", "Directory is empty", dispatch);
      return;
    }

    dispatch(
      launchAutoCloseWaitingModal("Uploading your Directory.. please wait")
    );

    var filtered_files = Array.from(files).filter(
      (file) => file.webkitRelativePath.indexOf("node_modules/") == -1
    );

    if (dirStack.length > 1) {
      var dirNameArr = dirStack.map((dir) => dir.name);
      var basePath = dirNameArr.join("/") + "/";

      for (let file of filtered_files) {
        const rPath = file.webkitRelativePath;
        file.relativePath = basePath + rPath;
      }
    } else {
      for (let file of filtered_files) {
        const rPath = file.webkitRelativePath;
        file.relativePath = rPath;
      }
    }

    var totalFiles = filtered_files.length;
    var filesUploading = [];
    const incProgress = ()=>{
       let progress = (filesUploading.length/totalFiles)*100;
       let currentFile = filesUploading[filesUploading.length-1];
       dispatch(setWaitingModalProgress(progress))
       dispatch(setModalWaitingText(`Uploading ${filesUploading.length} of ${totalFiles} (${currentFile.name})`))
    }

    dispatch(setWaitingModalProgress(0));

    // uploading files

    for (let file of filtered_files) {
      filesUploading.push(file);
      incProgress();
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("relativePath", file.relativePath);
      fileData.append("project", projectId);
      fileData.append("directory", parentDirectoryId);

      try {
        const response = await fetch(`/file/upload-path`, {
          method: "POST",
          credentials: "include",
          body: fileData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file: " + file.webkitRelativePath);
        }
      } catch (error) {
        console.error(error);
        message("Error", "Failed to upload some files", dispatch);
        break;
      }

    }

    await refreshDirectory(dispatch, parentDirectoryId)
    dispatch(setWaitingCompleted());
  }

  function addFolderSubmit(e) {
    e.preventDefault();
    const FolderName = e.target.querySelector("#FolderName");
    fetch("/directory/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: FolderName.value,
        projectId: projectId,
        parentDirectoryId: parentDirectoryId,
      }),
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          handleClose();
        }
        return response.json();
      })
      .then((data) => {
        dispatch(addFolder(data));
        socketOp({ type: "create", target: "folder", data: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Modal
      show={show}
      id="addFileFolderModal"
      centered
      aria-labelledby="addFileFolderModalLabel"
      aria-hidden="true"
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title
          className="text-center fw-bold"
          id="addFileFolderModalLabel"
        >
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

        <div className="button-wrapper d-flex justify-content-center align-items-center my-3">
          <Button
            variant="success"
            onClick={() => {
              folderInputRef.current.click();
            }}
          >
            Upload Folder
          </Button>
        </div>

        <form
          method="POST"
          encType="multipart/form-data"
          style={{ display: "none" }}
        >
          <input
            type="file"
            name="files"
            multiple
            webkitdirectory="true"
            directory="true"
            ref={folderInputRef}
            onChange={uploadFolder}
          />
        </form>

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
          <Button
            type="button"
            variant="success"
            className="upload-file-btn"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            Upload File
          </Button>
        </div>

        <Form
          id="file-upload-form"
          style={{ display: "none" }}
          encType="multipart/form-data"
          ref={uploadform}
        >
          <Form.Control
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={uploadFile}
          />
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
