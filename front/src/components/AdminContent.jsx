import React, { useState, useEffect } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import for theme

const AdminContent = () => {
  const [categoryName, setCategoryName] = useState('');
  const [themeName, setThemeName] = useState('');
  const [categories, setCategories] = useState([]);
  const [themePermissions, setThemePermissions] = useState({});
  const user = useSelector(state => state.auth.user);
  const [errorAlert, setErrorAlert] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const theme = createTheme();
  const [categoryId, setCategoryId] = useState(null);
  const [themeId, setThemeId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newThemeName, setNewThemeName] = useState('');
  
  useEffect(() => {
    // Recuperar todas las categorías
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      setCategories(response.data);
    } catch (error) {
      console.error('Error al recuperar las categorías:', error);
    }
  };

  const handleCategorySubmit = async () => {
    try {
      if (categoryName) {
        await axios.post('/api/categories', { name: categoryName }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setCategoryName('');
        fetchCategories()
      }
    } catch (error) {
      console.error('Error creando categoría:', error);
      alert('Hubo un error al crear la categoría. Por favor, inténtelo de nuevo.');
    }
  };
  
  const handleThemeSubmit = async () => {
    try {
      if (themeName && themePermissions) {
        await axios.post('/api/themes', {
          name: themeName,
          permissions: themePermissions
        }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setThemeName('');
        setThemePermissions({});
      } else {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error creando temática:', error);
      alert('Hubo un error al crear la temática. Por favor, inténtelo de nuevo.');
    }
  };
  
  const handlePermissionChange = (categoryName, checked) => {
    setThemePermissions(prevState => ({
      ...prevState,
      [categoryName]: checked
    }));
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleCategoryDelete = async () => {
    try {
      if (categoryId) {
        await axios.delete(`/api/categories/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        fetchCategories();
        setCategoryName('');
        setCategoryId('');
      } else {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      alert('Hubo un error al eliminar la categoría. Por favor, inténtelo de nuevo.');
    }
  };

  const handleThemeDelete = async () => {
    try {
      if (themeId) {
        await axios.delete(`/api/themes/${themeId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setThemeId('');
      } else {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error eliminando tema:', error);
      alert('Hubo un error al eliminar el tema. Por favor, inténtelo de nuevo.');
    }
  };
  
  const handleCategoryUpdate = async () => {
    try {
      if (categoryId && newCategoryName) {
        await axios.put(`/api/categories/${categoryId}`, {
          name: newCategoryName
        }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setNewCategoryName('');
        setCategoryId('');
        fetchCategories();
      } else {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      alert('Hubo un error al actualizar la categoría. Por favor, inténtelo de nuevo.');
    }
  };
  
  const handleThemeUpdate = async () => {
    try {
      if (themeId && newThemeName) {
        await axios.put(`/api/themes/${themeId}`, {
          name: newThemeName,
          permissions: themePermissions
        }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setNewThemeName('');
        setThemeId('');
      } else {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error actualizando tema:', error);
      alert('Hubo un error al actualizar el tema. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} mb={10}>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} mt={10} gap={10}>
          <Box display={'flex'} flexDirection={'column'} gap={2} border={'solid 2px'} p={5} borderRadius={8}>
            <Typography variant="h4">Categorías</Typography>
            <Button variant="contained" size="large" onClick={() => handleOptionSelect('category')}>
              Crear
            </Button>
            <Button variant="contained" size="large" sx={{ bgcolor: '#16751e', '&:hover': { bgcolor: '#1fa62b' } }} onClick={() => handleOptionSelect('updateCategory')}>
              Actualizar
            </Button>
            <Button variant="contained" size="large" color='error' onClick={() => handleOptionSelect('deleteCategory')}>
              Eliminar
            </Button>
          </Box>
          <Box display={'flex'} flexDirection={'column'} gap={2} border={'solid 2px'} p={5} borderRadius={8}>
            <Typography variant="h4">Tematicas</Typography>
            <Button variant="contained" size="large" onClick={() => handleOptionSelect('theme')}>
              Crear
            </Button>
            <Button variant="contained" size="large" sx={{ bgcolor: '#16751e', '&:hover': { bgcolor: '#1fa62b' } }} onClick={() => handleOptionSelect('updateTheme')}>
            Actualizar
            </Button>
            <Button variant="contained" size="large" color='error' onClick={() => handleOptionSelect('deleteTheme')}>
              Eliminar
            </Button>
          </Box>
        </Box>

        {selectedOption === 'category' && (
          <Box display={'flex'} minWidth={500} flexDirection={'column'} mt={4} gap={4}>
          <Typography variant="h4">Crear Categoría de Contenido</Typography>
            <TextField
              label="Nombre de Categoría"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Button variant="contained" onClick={handleCategorySubmit}>Crear Categoría</Button>
          </Box>
        )}
        {selectedOption === 'updateCategory' && (
          <Box display={'flex'} minWidth={500} flexDirection={'column'} mt={4} gap={4}>
            <Typography variant="h4">Actualizar Categoría de Contenido</Typography>
            <TextField
              label="Nuevo Nombre de Categoría"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Box width={'100%'}>
              <Typography variant="h6">Introduzca el ID</Typography>
              <input style={{width: '100%'}} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
            </Box>
            <Button variant="contained" onClick={handleCategoryUpdate}>Actualizar Categoría</Button>
          </Box>
        )}

        {selectedOption === 'deleteCategory' && (
          <Box display={'flex'} minWidth={500} flexDirection={'column'} mt={4} gap={4}>
            <Typography variant="h4">Eliminar Categoría de Contenido</Typography>
            <Box width={'100%'}>
              <Typography variant="h6">Introduzca el ID</Typography>
              <input style={{width: '100%'}} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />            
            </Box>
            <Button variant="contained" onClick={handleCategoryDelete}>Eliminar Categoría</Button>
          </Box>
        )}
        {selectedOption === 'theme' && (
          <Box display={'flex'} minWidth={500} flexDirection={'column'} mt={4} gap={2}>
            <Typography variant="h4">Crear Nueva Temática</Typography>
            <TextField
              label="Nombre de Temática"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
            />
            <Box display={'flex'} flexDirection={'column'}>
            {categories.map(category => (
              <FormControlLabel
                key={category._id}
                control={<Checkbox
                  checked={themePermissions[category.name]?.allow}
                  onChange={(e) => handlePermissionChange(category.name, e.target.checked)}
                />}
                label={`Permitir ${category.name}`}
              />
            ))}
            </Box>
            <Button variant="contained" onClick={handleThemeSubmit}>Crear Temática</Button>
          </Box>
        )}

        {selectedOption === 'updateTheme' && (
          <Box display={'flex'} minWidth={500} flexDirection={'column'} mt={4} gap={2}>
            <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="h4">Actualizar Temática</Typography>
            <TextField
              label="Nuevo Nombre de Temática"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
            />
            {categories.map(category => (
              <FormControlLabel
                key={category._id}
                control={<Checkbox
                  checked={themePermissions[category.name]?.allow}
                  onChange={(e) => handlePermissionChange(category.name, e.target.checked)}
                />}
                label={`Permitir ${category.name}`}
              />
            ))}
            </Box>
            <Box width={'100%'}>
              <Typography variant="h6">Introduzca el ID</Typography>
              <input style={{width: '100%'}} value={themeId} onChange={(e) => setThemeId(e.target.value)} />
            </Box>
            <Button variant="contained" onClick={handleThemeUpdate}>Actualizar Temática</Button>
          </Box>
        )}

        {selectedOption === 'deleteTheme' && (
          <Box display={'flex'} minWidth={500} flexDirection={'column'} mt={4} gap={4}>
            <Typography variant="h4">Eliminar Tematica</Typography>
            <Box width={'100%'}>
              <Typography variant="h6">Introduzca el ID</Typography>
              <input style={{width: '100%'}} value={themeId} onChange={(e) => setThemeId(e.target.value)} />
            </Box>
            <Button variant="contained" onClick={handleThemeDelete}>Eliminar Tematica</Button>
          </Box>
        )}

        {errorAlert && (
          <Box
            position="fixed"
            width={300}
            top={theme.spacing(2)}
            right={theme.spacing(2)}
            zIndex={theme.zIndex.modal + 1}
          >
            <Alert severity="error">
              Debes completar la información
            </Alert>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AdminContent;
