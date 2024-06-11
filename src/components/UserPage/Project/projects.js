import React, { useState } from 'react';
import ProjectBody from './ProjectBody';
import AddProjectModal from './addProjectModal';
import { useSelector } from 'react-redux';
import { Button, Container } from 'react-bootstrap';
import { LoadingContainer, NothingToShowContainer } from '../../../globalComponents/utilityContainers';

export default function Projects() {
  const [showModal, setShowModal] = useState(false);

  function handleShowModal() {
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function CreateProjectButton() {
    return (
      <div className="create-project-button m-5">
        <Button variant="primary" size="lg" onClick={handleShowModal}>
          Create Project
        </Button>
      </div>
    );
  }

  const project = useSelector((state) => state.project);
  const projects = project.projects;
  return (
    <>
      <Container className="project-container my-3">
        {projects.length > 0 ? (
          projects.map((project) => {
            if (project) {
              return <ProjectBody key={project.projectId} project={project} />;
            }
          })
        ) : (
          (project.loading)? <LoadingContainer text="Loading your projects"/> : <NothingToShowContainer text="No Projects"/>
        )}
      </Container>

      <CreateProjectButton />
      <AddProjectModal show={showModal} handleClose={handleCloseModal} />
    </>
  );
}
