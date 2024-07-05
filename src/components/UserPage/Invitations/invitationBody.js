import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { removeInvitation } from '../../../redux/slices/invitationSlice';
import { useDispatch } from 'react-redux';
import { createNewProject } from '../../../redux/slices/projectSlice';
import { formatDateForInvite } from '../../../utils/formatTime';

export default function InvitationBody(props) {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);
    const [acceptText, setAcceptText] = useState('Accept')
    const [rejectText, setRejectText] = useState('Reject')
    const dispatch = useDispatch();

    function acceptInvitation() {
        setIsDisabled(true);
        fetch('/invitation/accept', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: props.invitation._id
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setAcceptText('Accepted')
            setTimeout(() => setIsRemoved(true), 2000);
            dispatch(removeInvitation(props.invitation._id))
            dispatch(createNewProject(data))
        }).catch((error) => {
            console.log(error);
        });
    }

    function rejectInvitation() {
        setIsDisabled(true);
        fetch('/invitation/reject', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: props.invitation._id
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRejectText('Rejected')
            setTimeout(() => setIsRemoved(true), 2000);
            dispatch(removeInvitation(props.invitation._id))
        }).catch((error) => {
            console.log(error);
        });
    }

    if (isRemoved) {
        return null;
    }

    return (
        <Row className="my-2 invitation-body">
            <Col md={12}>
                <Card>
                    <Card.Body>
                        <Card.Title>{props.invitation.project.name}</Card.Title>
                        <Card.Text>
                            {props.invitation.sender.UserName} has invited you on { formatDateForInvite(props.invitation.created_at) }
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <Button variant="success" className="mx-1" onClick={acceptInvitation} disabled={isDisabled}>
                            {acceptText}
                        </Button>
                        <Button variant="danger" className="mx-1" onClick={rejectInvitation} disabled={isDisabled}>
                            {rejectText}
                        </Button>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
}
