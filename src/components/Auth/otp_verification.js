import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "../../styles/otp_verification.css";
import { UserAuthenication } from "../../redux/api/authAPI";
import { useDispatch } from "react-redux";
import { message } from "../../globalComponents/utilityModal";

export default function OTP_verification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const OTPrefs = useRef(
    Array(6)
      .fill(null)
      .map(() => React.createRef())
  );

  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    var timer;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      setCountdown(30);
    }

    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  function getOTPValue(index) {
    if (index !== -1) {
      if (
        OTPrefs.current[index].current &&
        OTPrefs.current[index].current.value
      ) {
        return OTPrefs.current[index].current.value;
      } else {
        return "";
      }
    }
    var OTP = [];
    for (let i = 0; i < 6; i++) {
      if (OTPrefs.current[i].current && OTPrefs.current[i].current.value) {
        OTP.push(OTPrefs.current[i].current.value);
      } else {
        OTP.push("");
      }
    }
    return OTP;
  }

  function checkotp_complete() {
    for (let i = 0; i < 6; i++) {
      if (getOTPValue(i).length === 0) {
        return false;
      }
    }
    return true;
  }

  function forward_otp_number(otpnum, index) {
    if (index >= 0 && index <= 5) {
      if (otpnum > 10) {
        let dig1 = parseInt(otpnum.toString()[0]);
        OTPrefs.current[index].current.value = dig1.toString();
        if (index === 5) {
          submitOtp();
          return;
        }
        if (index + 1 <= 5) {
          OTPrefs.current[index + 1].current.focus();
          let remdig = parseInt(otpnum.toString().substring(1));
          forward_otp_number(remdig, index + 1);
        }
      } else {
        OTPrefs.current[index].current.value = otpnum.toString();
        if (index === 5) {
          submitOtp();
          return;
        }
        if (index + 1 <= 5) {
          OTPrefs.current[index + 1].current.focus();
        }
      }
    }
  }

  function handleBackspace(event) {
    if (event.key === "Backspace") {
      event.preventDefault();
      let index = parseInt(document.activeElement.getAttribute('data-otpindex'));
      if (index > 0) {
        if (getOTPValue(index).length === 0) {
          OTPrefs.current[index - 1].current.focus();
          return;
        } else {
          OTPrefs.current[index].current.value = ''
        }
      } else if (index === 0) {
        OTPrefs.current[index].current.value = ''
      }
    }
  }

  const handleOtpChange = (e) => {
    const otpindex = parseInt(e.target.dataset.otpindex);
    const newOtp = e.target.value;

    forward_otp_number(newOtp, otpindex);
  };

  const submitOtp = () => {
    if (!checkotp_complete()) {
      return;
    }
    var otp = getOTPValue(-1);
    console.log("Entered OTP:", otp);
    fetch("http://localhost:7000/auth/verify-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        OTP: otp,
      }),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 302) {
          UserAuthenication(dispatch);
          navigate('/auth/addprofile');
          return;
        } else {
          response.json().then((data) => {
            message('Error', 'Incorrect OTP', dispatch);
          });
        }
      } else {
        navigate('/auth/addprofile');
        return;
      }
    });
  };

  const handleResendOtp = () => {
    setResendDisabled(true);
    console.log("Resending OTP...");
    fetch('http://localhost:7000/auth/resend-otp', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (!response.ok) {
        alert(`Error ${response.status}`);
      }
      return response.json();
    }).then((data) => { console.log(data) }).catch(error => console.log(error));
  };

  return (
    <Container className="form-container p-4 animate__animated animate__zoomIn">
      <h1 className="fs-2 fw-bolder text-center">Enter The OTP</h1>
      <Form>
        <p className="form-text text-light text-center">
          Enter the six-digit OTP sent to your email address
        </p>
        <Row className="justify-content-center">
          {OTPrefs.current.map((v, index) => (
            <Col xs="auto" key={index}>
              <Form.Control
                type="number"
                className="otpblock"
                onInput={handleOtpChange}
                onKeyDown={handleBackspace}
                data-otpindex={index}
                id={`otp-${index}`}
                ref={OTPrefs.current[index]}
                style={{ width: '3rem', textAlign: 'center' }}
              />
            </Col>
          ))}
        </Row>
      </Form>
      <div className="text-center mt-3">
        {resendDisabled ? (
          <span>Resend OTP in {countdown} seconds</span>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="my-3"
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
        )}
      </div>
    </Container>
  );
}
