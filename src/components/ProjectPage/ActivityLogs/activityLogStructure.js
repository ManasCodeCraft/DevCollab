import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';

function getFormattedTime(date) {
  date = new Date(date);
  const time24hr = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return time24hr;
}

export default function ActivityLogStructure({log}) {
  return (
    <Row className="my-2 activity-log-body">
      <Col md={12}>
        <Card>
          <Card.Body>
            <Card.Text>
              <span className="username">{log.user.UserName}</span> : <span className='activity'>{log.activity} </span> at <span className="activity-time">{getFormattedTime(log.createdAt)}</span>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
