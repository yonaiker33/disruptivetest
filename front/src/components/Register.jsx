import React, { useState } from 'react';
import { Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import axios from 'axios';
import { login } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import for theme

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [errorAlert, setErrorAlert] = useState(false);

  const theme = createTheme();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.role !== 'lector' && formData.role !== 'creador') {
      alert('Invalid role.');
      return;
    }
  
    try {
      const response = await axios.post(
        'api/users/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization', 
          }
        }
      );
      if(response.data.error){
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }else{
        const data = response.data;
        dispatch(login({email: data.user.email, password: formData.password}));
        console.log('User created successfully:', response.data.user);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <Box mt={7} display={'flex'} flexDirection={'column'} fullWidth alignItems={'center'}>
        <Box display={'flex'} flexDirection={'column'} maxWidth={500}> 
          {errorAlert && (
            <Box
              position="fixed"
              width={300}
              top={theme.spacing(2)}
              right={theme.spacing(2)}
              zIndex={theme.zIndex.modal + 1}
            >            
              <Alert severity="error">
                El usuario ingresado ya existe.
              </Alert>
            </Box>
          )}
          <Typography variant="h4" gutterBottom>Register User</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
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
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="lector">Lector</MenuItem>
                <MenuItem value="creador">Creador</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2} display='flex' justifyContent={'end'}>
                <Button type="submit" variant="contained" color="primary">Register</Button>
            </Box>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Register;
