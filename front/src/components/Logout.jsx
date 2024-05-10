import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="primary">
      Cerrar sesión
    </Button>
  );
}

export default Logout;
