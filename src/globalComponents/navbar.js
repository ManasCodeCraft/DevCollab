import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Container, Dropdown, Button, Image } from 'react-bootstrap';
import { logout } from '../redux/slices/authSlice';
import '../styles/navStyles.css'; // Keep your custom styles
import { confirmIt } from './utilityModal';
import { toggleDarkMode } from '../redux/slices/configSlice';

export default function CustomNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector(state => state.auth.user.username)
  const userProfile = useSelector((state) => state.auth.user.profilePic);
  const isLogin = useSelector((state) => state.auth.isAuthenticated);
  const darkMode = useSelector(state => state.config.darkMode);

  const handleLogout = () =>{
       confirmIt('LogOut', 'Are your sure you want to log out?', userLogout, null, 'Log out', 'cancel', 'danger', dispatch);
  }
  const userLogout = () => {
    fetch('http://localhost:7000/auth/user-logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          dispatch(logout());
          navigate('/auth/login');
        }
        return response.json();
      })
      .then((data) => console.log(data.message))
      .catch((err) => console.log(err));
  };

  const handleDeleteAccount = () => {
    confirmIt('Delete Account', 'Are your sure you want to delete your account?', deleteAccount, null, 'Delete Account', 'cancel', 'danger', dispatch);
  }
  const deleteAccount = () => {
    fetch('http://localhost:7000/auth/user-deleteAccount', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          navigate('/auth/login');
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container fluid>
        <Navbar.Brand className="fw-bold fs-3 nav-brand-name" as={Link} to={isLogin ? '/user/projects' : '/'} >
          &lt; DevCollab /&gt;
        </Navbar.Brand>
        <div className="ms-auto">
          {isLogin ? (
            <Dropdown align="end">
              <Dropdown.Toggle as={Image} src={userProfile} onError={(e)=>{e.target.src='/userProfilePic.jpg'}} roundedCircle width={30} height={30} id="user-dropdown" />
              <Dropdown.Menu>
                <Dropdown.Item className='text-info fw-bold'>
                  <ion-icon name="person-outline"></ion-icon> {username}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/auth/addprofile">
                  <ion-icon name="swap-horizontal-outline"></ion-icon> Change Profile Pic
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <ion-icon name="person-remove-outline"></ion-icon> Logout
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteAccount}>
                <ion-icon name="trash-outline"></ion-icon> Delete Account
                </Dropdown.Item>
                <Dropdown.Item onClick={()=>{dispatch(toggleDarkMode())}}>
                  <ion-icon name={(darkMode)? 'moon-outline' : 'sunny-outline'}></ion-icon> {(darkMode)? "Dark Mode" : "Light Mode" }
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="primary" onClick={() => navigate('/auth/login')}>
              Login
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
