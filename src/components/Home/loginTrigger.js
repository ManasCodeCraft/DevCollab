import React from 'react'
import {Container, Button} from 'react-bootstrap'
import { useNavigate } from 'react-router';
import { useInView } from 'react-intersection-observer'

export default function TriggerLogin() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5
  })
  const boxShadow = {
    boxShadow: '0 0 30px rgb(156, 189, 255)'
  }

  return (
    <Container className="login-to-start p-5" style={(inView)?boxShadow: {}} ref={ref}>
    <div className="contentbox my-5">
       <h1 className="fs-1 fw-bold">Start Your <span>Project</span> Now</h1>
       <div className="buttonwrapper text-center">
        <Button variant='outline-primary' size='lg' onClick={()=>navigate('/auth/login')}>Login to Start</Button>
       </div>
    </div>
    </Container>
  )
}
