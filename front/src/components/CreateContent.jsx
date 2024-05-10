import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

function CreateContent() {
  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    url: '',
    theme: '',
    file: null,
    username: ''
  });
  const [fileUploaded, setFileUploaded] = useState(false); // Estado para indicar si se cargó un archivo
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // Fetch categories
    axios.get('/api/categories', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    .then(response => {
      setCategories(response.data);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });

    // Fetch themes
    axios.get('/api/themes', {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    .then(response => {
      setThemes(response.data);
    })
    .catch(error => {
      console.error('Error fetching themes:', error);
    });

    // Set default username
    setFormData(prevState => ({
      ...prevState,
      username: user.user.username
    }));
  }, [user.token, user.user.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      file: e.target.files[0]
    }));
    setFileUploaded(true); // Indicar que se ha cargado un archivo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('type', formData.type);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('url', formData.url);
    formDataToSend.append('theme', formData.theme);
    formDataToSend.append('username', formData.username);
    if (formData.file) {
        formDataToSend.append('file', formData.file);
    }
    try {
      const response = await axios.post('/api/contents', formDataToSend, {
        headers: {
            'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log('Respuesta del servidor:', response.data);
      // Restablecer el formulario después de enviar los datos
      setFormData({
        type: '',
        title: '',
        description: '',
        url: '',
        theme: '',
        file: null,
        username: user.user.username
      });
      setFileUploaded(false); // Reiniciar el estado de carga de archivo
    } catch (error) {
      console.error('Error al enviar el contenido:', error);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 5
        }}
      >
        <Typography variant="h4" gutterBottom>
          Crear Contenido
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '50%' }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="theme-label">Tema</InputLabel>
            <Select
              labelId="theme-label"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              label="Tema"
              required
            >
              {themes.map(theme => (
                <MenuItem key={theme._id} value={theme.name}>{theme.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {formData.theme && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="type-label">Tipo</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Tipo"
                required
              >
                {themes
                  .filter(theme => theme.name === formData.theme)
                  .map(selectedTheme => (
                    categories.map(cat => (
                      selectedTheme.permissions &&
                      Object.entries(selectedTheme.permissions).map(([type, allowed]) => (
                        allowed && type === cat.name && <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                      ))
                    ))
                  ))}
              </Select>
            </FormControl>
          )}
          <TextField
            margin="normal"
            fullWidth
            id="title"
            name="title"
            label="Título"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            name="description"
            label="Descripción"
            value={formData.description}
            onChange={handleChange}
          />
          {formData.type === 'Videos' && (
            <TextField
              margin="normal"
              fullWidth
              id="url"
              name="url"
              label="URL"
              value={formData.url}
              onChange={handleChange}
              required
            />
          )}
          <input
            accept="image/*, application/pdf, text/plain"
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file">
            <Button
              variant="contained"
              component="span"
              sx={{ mt: 2 }}
              disabled={formData.type !== 'Imagenes' && formData.type !== 'Documentos'}
            >
              Subir Archivo
            </Button>
          </label>
          {fileUploaded && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              Archivo cargado: {formData.file.name}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Crear Contenido
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateContent;
