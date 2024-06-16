import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from '../../globalComponents/utilityModal';
import '../../styles/resetPassword.css';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var urlparams = new URLSearchParams(window.location.search);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('id', urlparams.get('id'));
    formData.append('resetToken', urlparams.get('reset_password_token'));

    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(`/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const data = await response.json();
        const message_ = data.message || data.ErrorMessage || 'Failed to change password';
        message(`Error ${response.status}`, message_, dispatch);
        return;
      } else {
        navigate('/user/projects');
      }
    } catch (error) {
      message('', 'An error occurred', dispatch);
    }
  }

  return (
    <Container className="form-container p-4 animate__animated animate__fadeInUp">
      <h1 className="fs-2 fw-bolder text-center">Reset Your Password</h1>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="password-block">
          <Form.Label htmlFor="password">New Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            name="password"
            aria-describedby="passwordHelpBlock"
          />
          <Form.Text id="password_error" className="form-error">
          </Form.Text>
        </Form.Group>
        <Form.Group className="confirm-password-block">
          <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirm-password"
            name="confirmPassword"
          />
          <Form.Text id="confirm-password_error" className="form-error">
          </Form.Text>
        </Form.Group>
        <div className="buttonwrapper w-full text-center">
          <Button type="submit" className="btn btn-primary btn-lg btn-submit mx-auto my-3">Reset Password</Button>
        </div>
      </Form>
    </Container>
  );
}
