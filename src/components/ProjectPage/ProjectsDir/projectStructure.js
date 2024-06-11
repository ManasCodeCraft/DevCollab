import React, { useState } from 'react';
import BreadCrumbNav from './breadCrumbNav';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import FileStructure from './fileStructure';
import FolderStructure from './folderStructure';
import AddFileFolderModal, { AddFileFolderButton } from './addFileFolderModal';
import { LoadingContainer, NothingToShowContainer } from '../../../globalComponents/utilityContainers';
import { Container } from 'react-bootstrap';

export default function ProjectStructure() {
  const navigate = useNavigate();
  const [addModalShow, setAddModalShow] = useState(false);

  const handleAddModalClose = () => setAddModalShow(false);
  const handleAddModalShow = () => setAddModalShow(true);

  const currentWorkingDirectory = useSelector(state=>state.project.currentWorkingDirectory);
  const isLoading = useSelector(state=>state.project.loading);

  if (!currentWorkingDirectory) {
    navigate('/user/projects');
    return null;
  }

  const projectDirs = currentWorkingDirectory.directories;
  const projectFiles = currentWorkingDirectory.files;
  const parentDirectoryId = currentWorkingDirectory.id;
  const projectId = currentWorkingDirectory.projectId;

  return (
    <>
      <BreadCrumbNav />
      {isLoading ? (
        <LoadingContainer text="Loading files and folders" />
      ) : (
        <>
          <Container className="project-structure-container">
            {(projectDirs && projectDirs.length>0)? projectDirs.map((dir) => (
              <FolderStructure dir={dir} key={dir.dirId} />
            )) : null
            }
            {projectFiles?.map((file) => (
              <FileStructure file={file} key={file.fileId} />
            ))}
            {(!projectDirs?.length && !projectFiles?.length) && (
              <NothingToShowContainer text="There are no files or folders in this directory" />
            )}
          </Container>

          <AddFileFolderModal
            projectId={projectId}
            parentDirectoryId={parentDirectoryId}
            show={addModalShow}
            handleClose={handleAddModalClose}
          />
          <AddFileFolderButton handleShow={handleAddModalShow} />
        </>
      )}
    </>
  );
}
