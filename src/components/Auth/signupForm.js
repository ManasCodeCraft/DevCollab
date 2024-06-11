import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import "../../styles/createAccount.css";
import { useDispatch } from 'react-redux';
import { HideWaitingModal, setWaitingModalParam } from '../../redux/slices/waitingModalSlice';
import { message } from '../../globalComponents/utilityModal';

// Define the Zod schema for validation
const validationSchema = z.object({
  UserName: z
    .string()
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_\-]+$/, "Username can only contain alphanumeric characters, hyphens, or underscores"),

  Email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),

  Password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),

  ConfirmPassword: z
    .string()
    .nonempty("Confirm Password is required"),
}).refine((data) => data.Password === data.ConfirmPassword, {
  message: "Passwords must match",
  path: ["ConfirmPassword"],
});

export default function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Initialize React Hook Form with Zod-based resolver
  const { register, handleSubmit, formState, reset, setError } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onSubmit",
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    dispatch(setWaitingModalParam({
        waiting_text: 'Creating Account ...',
        status: 'waiting',
        show: true,
    }))
    try {
      const response = await fetch('http://localhost:7000/auth/create-account', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      dispatch(HideWaitingModal())

      if (!response.ok) {
        if (response.status === 400) {
          const responseData = await response.json();
          if (responseData.errors) {
            Object.keys(responseData.errors).forEach((key) => {
               setError(key, {type: "mannual", message: responseData.errors[key] })
            });
          }
        } else {
          message('Error', 'Failed to SignUp', dispatch)
          return;
        }
      } else {
        navigate('/auth/otp-verification');
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="form-container p-4 animate__animated animate__zoomIn">
      <h1 className="fs-2 fw-bolder text-center">DevCollab - Sign Up</h1>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* UserName */}
        <Form.Group>
          <Form.Label htmlFor="user-name">Username</Form.Label>
          <Form.Control
            type="text"
            id="user-name"
            {...register("UserName")}
            isInvalid={!!errors.UserName}
          />
          {errors.UserName && (<Form.Control.Feedback type='invalid'>{errors.UserName.message}</Form.Control.Feedback>)}
        </Form.Group>

        {/* Email */}
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            {...register("Email")}
            isInvalid={!!errors.Email}
          />
          {errors.Email && (<Form.Control.Feedback type='invalid'>{errors.Email.message}</Form.Control.Feedback>)}
        </Form.Group>

        {/* Password */}
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            {...register("Password")}
            isInvalid={errors.Password}
          />
          {errors.Password && (<Form.Control.Feedback type='invalid'>{errors.Password.message}</Form.Control.Feedback>)}
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group>
          <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirm-password"
            {...register("ConfirmPassword")}
            isInvalid={errors.ConfirmPassword}
          />
          {errors.ConfirmPassword && (<Form.Control.Feedback type='invalid'>{errors.ConfirmPassword.message}</Form.Control.Feedback>)}
        </Form.Group>

        {/* Submit Button */}
        <div className="buttonwrapper w-full text-center mt-3">
          <Button variant='primary' type='submit'>SignUp</Button>
        </div>

        {/* Navigation to Login */}
        <div className="text-center mt-3">
          <Button
            type="button"
            variant='outline-info'
            onClick={() => navigate('/auth/login')}
          >
            Login with Previous Account
          </Button>
        </div>
      </Form>
    </div>
  );
}
