import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Card, CardContent, Modal, Backdrop, Fade, Alert } from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import for theme
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';

function ThemeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [errorAlert, setErrorAlert] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const theme = createTheme();
  const user = useSelector(state => state.auth.user);

  const handleSearch = () => {
    axios.get(`/api/contents/themes?q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 5000);
      });
  };

  const handleImageClick = (imgUrl) => {
    setModalImgUrl(imgUrl);
    setOpenModal(true);
  };

  const handleDownloadClick = (fileData, fileName) => {
    const link = document.createElement('a');
    link.href = `data:${fileData.contentType};base64,${fileData.data}`;
    link.download = fileName;
    link.click();
  };

  const getYouTubeId = url => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match && match[1] ? match[1] : '';
  };

  const handleFileClick = (fileData, fileName) => {
    if (fileData.contentType && fileData.contentType.startsWith('image')) {
      handleImageClick(`data:${fileData.contentType};base64,${fileData.data}`);
    } else {
      handleDownloadClick(fileData, fileName);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box mt={2}>
        {errorAlert && (
          <Box
            position="fixed"
            width={300}
            top={theme.spacing(2)}
            right={theme.spacing(2)}
            zIndex={theme.zIndex.modal + 1}
          >
            <Alert severity="error">
              Debes iniciar sesión para realizar esta acción
            </Alert>
          </Box>
        )}
        <Box display={'flex'} gap={2} justifyContent={'center'} alignItems={'center'}>
          <Box display={'flex'} gap={1} alignItems={'center'}> 
            <Typography variant="h6" gutterBottom>Buscar temas:</Typography>
            <TextField
              variant="outlined"
              placeholder="Temas"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleSearch}>Buscar</Button>
        </Box>
        <Box mt={2}>
          <Box display={'flex'} gap={4} flexDirection={'column'}>
            {Object.keys(searchResults).map(themeType => (
              <Box key={themeType}>
                <Typography variant="h6">{themeType}</Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {searchResults[themeType].map(theme => (
                    <Card key={theme._id} sx={{ width: 300 }}>
                      <CardContent>
                        <Typography variant="h5" component="h2">{theme.title}</Typography>
                        <Typography variant="body2" component="p">{theme.description}</Typography>
                        {theme.image && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleImageClick(theme.image)}
                          >
                            Ver Imagen
                          </Button>
                        )}
                        {theme.url && theme.type === "Videos" && (
                          <YouTube videoId={getYouTubeId(theme.url)} opts={{ width: '100%', height: '200px' }} />
                        )}
                        {theme.file && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFileClick(theme.file, theme.title)}
                          >
                            {theme.file.contentType && theme.file.contentType.startsWith('image') ? 'Ver Imagen' : 'Descargar Archivo'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Modal para mostrar imágenes */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="image-modal"
          aria-describedby="modal-to-display-image"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box sx={{
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              width: '80%',
              maxWidth: '800px',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              }}>
              <img src={modalImgUrl} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default ThemeSearch;
