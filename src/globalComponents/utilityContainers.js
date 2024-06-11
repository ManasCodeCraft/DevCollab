import React from "react";
import { Container, Spinner } from "react-bootstrap";

export function NothingToShowContainer(props) {
  return (
    <Container className="nothing-to-show-container border rounded">
      <div className="nothing-to-show text-secondary text-center">
        {props.text ? props.text : "Nothing to Show"}
      </div>
    </Container>
  );
}

export function LoadingContainer(props) {
  return (
    <Container rounded className="loading-container border rounded">
      <div className="spinner-wrapper">
        <Spinner animation="grow" />
        <div className="loading text-secondary text-center">
          {props.text ? props.text : "Loading..."}
        </div>
      </div>
    </Container>
  );
}
