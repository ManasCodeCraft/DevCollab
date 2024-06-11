import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Card, Row, Col, Dropdown, Image } from "react-bootstrap";
import { confirmIt, message } from "../../../globalComponents/utilityModal";

export default function CollaboratorStructure(props) {
  const projectId = useSelector(
    (state) => state.project.currentProject.projectId
  );
  const ifUserIsOwner = useSelector(state => state.project.currentProject.owner);
  const currentUserId = useSelector(state=>state.auth.user.userid)
  const dispatch = useDispatch();

  function handleRemoveCollaborator() {
    confirmIt(
      "Remove Collaborator",
      "Are you sure you want to remove collaborator",
      removeCollaborator,
      null,
      "remove",
      "cancel",
      "danger",
      dispatch
    );
  }
  function removeCollaborator() {
    var id = props.collaborator.id;
    if (!id || !projectId) {
      message("Error", "Unexpected Error Occurred", dispatch);
      console.log("CollaboratorId and ProjectId not found");
      return;
    }
    fetch("http://localhost:7000/project/remove-collaborator", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collaboratorId: id,
        projectId: projectId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          const status = response.status
          response.json().then((data) => {
            message(
              `Error ${status}`,
              data.message || "An Error Occurred",
              dispatch
            );
          });
        }
      })
      .catch((err) => {
        message("Error", "unexpected error", dispatch);
        console.log(err);
      });
  }

  return (
    <Row className="my-2 collaborator-structure">
      <Col md={12}>
        <Card>
          <Card.Body>
            <Card.Title className="d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center">
                <Image
                  src={props.collaborator.profile}
                  alt=""
                  roundedCircle
                  width="40"
                  height="40"
                  className="me-2"
                />
                {props.collaborator.name}
              </span>
              {(ifUserIsOwner && !(props.collaborator.id == currentUserId))? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    bsPrefix="p-0"
                    id="dropdown-basic"
                  >
                    <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={NavLink}
                      onClick={handleRemoveCollaborator}
                    >
                      Remove Collaborator
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : null}
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
