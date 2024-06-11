import React from "react";
import SignUpForm from "./signupForm";
import AddProfilePic from "./addProfilePic.js";
import {Route, Routes} from 'react-router-dom'
import '../../styles/authStyles.css'
import LoginForm from "./loginForm.js";
import OTP_verification from "./otp_verification.js";
import ResetPassword from "./resetPassword.js";
import CanvasBg from "../../globalComponents/canvasBg.js";
import AccountRecovery from "./accountRecovery.js";
 
export default function AuthForm() {
  const canvasStyle = {
      position: 'fixed',
      top: 0,
      background: 'linear-gradient(to bottom, black, rgb(1, 1, 82), black)' ,
      width: '100%' ,
      height: '100vh' ,
      zIndex: -1,
  }

  return (
    <div>
      <div className="form-container-wrapper">
        <Routes>
           <Route path='signup' element={<SignUpForm/>} />
           <Route path='addprofile' element={<AddProfilePic/>} />
           <Route path='login' element={<LoginForm/>} />
           <Route path="otp-verification" element={<OTP_verification/>} />
           <Route path="account-recovery" element={<AccountRecovery/>} />
           <Route path='reset-password' element={<ResetPassword/>} />
        </Routes>
      </div>
      <CanvasBg id="auth-bg-canvas" style={canvasStyle}></CanvasBg>
    </div>
  );
}
