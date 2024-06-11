import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { message } from '../../globalComponents/utilityModal.js';
import { setWaitingModalParam } from '../../redux/slices/waitingModalSlice.js';
import { Container, Form, Button} from 'react-bootstrap';

export default function AccountRecovery() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const IdentityRef = useRef(null);
    const [errorState, setErrorState] = useState('');
    const baseURL = useSelector((state)=>state.config.baseURL);

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetch(`${baseURL}/auth/account-recovery`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Identity: IdentityRef.current.value
            })
        });

        if (!response.ok) {
            if (response.status >= 400 && response.status < 500) {
                const data = await response.json();
                let text_message = data.message || 'An Error has occurred';
                setErrorState(text_message);
            } else if (response.status >= 500) {
                const data = await response.json();
                let text_message = data.message || 'An Error has occurred';
                message(`Error ${response.status}`, text_message, dispatch);
            }
        } else {
            const data = await response.json();
            const message_ = data.message || 'Password Reset Link has been sent to your email';
            dispatch(setWaitingModalParam({
                after_text: message_,
                show: true,
                status: 'completed'
            }));
        }
    }

    return (
        <Container className="form-container p-4 animate__animated animate__zoomIn">
            <h1 className="fs-2 fw-bolder text-center">Enter Your UserName or Email</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="identity" className="mb-3">
                    <Form.Control
                        type="text"
                        name="Identity"
                        ref={IdentityRef}
                        onInput={() => { setErrorState(''); }}
                        required
                    />
                    {errorState && <Form.Text className="text-danger fw-bold">{errorState}</Form.Text>}
                </Form.Group>
                <div className="buttonwrapper w-full text-center">
                    <Button type="submit" className="btn btn-primary btn-lg btn-submit mx-auto my-3">Get Reset Link</Button>
                </div>
            </Form>
        </Container>
    );
}
