import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { Typography, Box, TextField, Button } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch(); // Obtener la función dispatch del store de Redux

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Despacha la acción de inicio de sesión con los datos del formulario
    dispatch(login(formData));
  };

  return (
    <Box mt={7} display={'flex'} flexDirection={'column'} fullWidth alignItems={'center'}>
      <Box display={'flex'} flexDirection={'column'} maxWidth={500}> 
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            variant="outlined"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">Login</Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
