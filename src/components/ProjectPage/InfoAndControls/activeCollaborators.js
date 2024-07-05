import React from "react";
import ActiveCollabortorStructure from "./activeCollabortorStructure";
import { Modal, Button } from "react-bootstrap";

export default function ActiveCollaborators({ collaborators, show, hideModal }) {
  return (
    <Modal show={show} centered>
      <Modal.Header closeButton>
        <Modal.Title>Active</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {collaborators.map((coll) => {
          return <ActiveCollabortorStructure
            name={coll.name}
            profile={coll.profile}
            key={coll.id}
          />;
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
