import React from "react";
import { Card, Col, Row } from "react-bootstrap";

export default function ActiveCollabortorStructure({name, profile}) {
  return (
    <Row className="my-2 active-collaborator-structure">
      <Col md={12}>
        <Card>
          <Card.Body>
            <Card.Title className="d-flex justify-content-between">
              <span>
                <img
                  src={profile}
                  alt=""
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
                &nbsp; {name}
              </span>
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
