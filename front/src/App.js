import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useDispatch, useSelector } from 'react-redux';

import Home from './components/Home';
import ThemeSearch from './components/ThemeSearch';
import ContentSearch from './components/ContentSearch';
import Register from './components/Register';
import Login from './components/Login';
import Library from './components/Library';
import { checkAuth } from './redux/actions/authActions';
import Logout from './components/Logout';
import AdminContent from './components/AdminContent';
import CreateContent from './components/CreateContent';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(checkAuth(token));
    }
  }, [dispatch]);

  // Función para verificar si un usuario tiene un rol específico
  const hasRole = (role) => {
    return isAuthenticated && user.user && user.user.role === role;
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Box>
            <Button color="inherit" component={Link} to="/"><HomeIcon sx={{ fontSize: 20 }} /> Inicio </Button>
            <Button color="inherit" component={Link} to="/explorar"><LibraryBooksIcon sx={{ fontSize: 20 }} /> Explorar </Button>
            <Button color="inherit" component={Link} to="/theme-search"><SearchIcon sx={{ fontSize: 20 }} /> Temas </Button>
            <Button color="inherit" component={Link} to="/content-search"><SearchIcon sx={{ fontSize: 20 }} /> Contenidos </Button>
          </Box>
          <Box>
            {!isAuthenticated && (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Registrarse</Button>
              </>
            )}

            {hasRole('admin') && (
              <Button color="inherit" component={Link} to="/admin">Administrar</Button>
            )}

            {(hasRole('admin') || hasRole('creador')) && (
              <Button color="inherit" component={Link} to="/crear">Crear contenido</Button>
            )}

            {isAuthenticated && <Logout />}
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/explorar' element={<Library />} />
          <Route path='/theme-search' element={<ThemeSearch />} />
          {hasRole('admin') && <Route path='/admin' element={<AdminContent />} />}
          {(hasRole('admin') || hasRole('creador')) && <Route path='/crear' element={<CreateContent />} />}
          <Route path='/content-search' element={<ContentSearch />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
