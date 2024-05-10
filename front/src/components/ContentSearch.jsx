import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Card, CardContent, Modal, Backdrop, Fade, Alert } from '@mui/material';
import axios from 'axios';
import YouTube from 'react-youtube';
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import for theme

function ContentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [errorAlert, setErrorAlert] = useState(false);
  const theme = createTheme();

  const handleSearch = () => {
    if(isAuthenticated){
      axios.get(`/api/contents?q=${searchTerm}`)
        .then(response => {
          setSearchResults(response.data);
        })
        .catch(error => {
          console.error('Error searching contents:', error);
        });
    }else{
      setErrorAlert(true)
    }

  };

  const handleImageClick = (dataUrl) => {
    setImageDataUrl(dataUrl);
    setOpenModal(true);
  };

  const handleDownloadClick = (dataUrl, fileName) => {
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = fileName;
    anchor.click();
  };

  const getYouTubeId = url => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match && match[1] ? match[1] : '';
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
                Debes iniciar sesion para realizar esta accion
              </Alert>
            </Box>
          )}
        <Box display={'flex'} gap={2} justifyContent={'center'} alignItems={'center'}>
          <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography variant="h6" gutterBottom>Buscar contenido:</Typography>
          <TextField
            variant="outlined"
            placeholder="Contenido"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          </Box>
          <Button variant="contained" color="primary" onClick={handleSearch}>Buscar</Button>
        </Box>
        <Box mt={2}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {Object.keys(searchResults).map(contentType => (
              searchResults[contentType].map(content => (
                <Card key={content._id} sx={{ width: 300 }}>
                  <CardContent>
                    <Typography variant="h5" component="h2">{content.title}</Typography>
                    <Typography color="textSecondary" gutterBottom>Tipo: {contentType}</Typography>
                    <Typography variant="body2" component="p">{content.description}</Typography>
                    {content.url && content.url.startsWith('https://www.youtube.com/') && (
                      <YouTube videoId={getYouTubeId(content.url)} opts={{ width: '100%', height: '200px' }} />
                    )}
                    {content.file && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (content.file.contentType && content.file.contentType.startsWith('image')) {
                            handleImageClick(`data:${content.file.contentType};base64,${content.file.data}`);
                          } else {
                            handleDownloadClick(`data:${content.file.contentType};base64,${content.file.data}`, content.title);
                          }
                        }}
                      >
                        {content.file.contentType && content.file.contentType.startsWith('image') ? 'Ver Imagen' : 'Descargar Archivo'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
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
              <img src={imageDataUrl} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
            </Box>
          </Fade>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default ContentSearch;
