import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { message } from '../../../globalComponents/utilityModal';

export default function InviteCollaboratorStructure(props) {
    const dispatch = useDispatch();
    const [invited, setInvited] = useState(false);

    function sendInvitation(recipientId, projectId) {
        fetch('/invitation/send', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipientId: recipientId,
                projectId: projectId
            })
        }).then((response) => {
            if (response.ok) {
                setInvited(true);
            } else {
                response.json().then(data => {
                    message(response.status, data.message || 'An Error occurred while sending invite request', dispatch);
                });
            }
            return response.json();
        }).catch((error) => {
            console.log(error);
        });
    }

    const projectId = useSelector(state => state.project.currentProject.projectId);
    if (!projectId) {
        message('Error', 'Unexpected error occured in opening project' )
        console.log('No project is opened currently');
        return null;
    }

    return (
        <Row className="my-2 collaborator-structure">
            <Col md={12}>
                <Card>
                    <Card.Body>
                        <Card.Title className="d-flex justify-content-between">
                            <span>
                                <img src={props.user.ProfilePic} alt="" className="rounded-circle" width="40" height="40" />
                                {props.user.UserName}
                            </span>
                            <div className="float-right">
                                <Button
                                    variant={invited ? 'dark' : 'success'}
                                    onClick={() => { sendInvitation(props.user._id, projectId); }}
                                    disabled={invited}
                                >
                                    {invited ? 'Invited' : 'Invite'}
                                </Button>
                            </div>
                        </Card.Title>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
