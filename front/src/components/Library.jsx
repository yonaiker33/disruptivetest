import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Modal, Backdrop, Fade } from '@mui/material';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';

function Library() {
  const [contents, setContents] = useState({ images: 0, videos: 0, texts: 0 });
  const [openModal, setOpenModal] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on('contentChange', (change) => {
      console.log('Cambio en la colección contents recibido:', change);
      fetchContents();
    });

    fetchContents();
    return () => {
      socket.disconnect();
    };
  }, [user.token]);

  const fetchContents = () => {
    axios.get(`/api/contents/library?q=${user.user ? user.user.role : 'prospect'}`)
      .then(response => {
        setContents(response.data);
      })
      .catch(error => {
        console.error('Error fetching contents:', error);
      });
  };

  const getYouTubeId = url => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return match[1];
    } else {
      return '';
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

  return (
    <Box mt={2} mb={4} display={'flex'} alignItems={'center'} flexDirection={'column'}>
      {Object.entries(contents).map(([tipo, contenido]) => (
        <Box key={tipo} mt={3}>
          <Typography variant="h4" gutterBottom>{tipo}</Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {contenido && contenido.map((dato, i) => (
              <Box key={dato.title + i} boxShadow={2} p={2} width={300} bgcolor="background.paper">
                <Typography variant="h5" component="h2">{dato.title}</Typography>
                <Typography color="textSecondary" gutterBottom>Tipo: {tipo}</Typography>
                <Typography variant="body2" component="p">{dato.description}</Typography>
                <Typography color="textSecondary" gutterBottom>Creado por: {dato.username}</Typography>
                <Typography color="textSecondary" gutterBottom>Creado el: {new Date(dato.createdAt).toLocaleString()}</Typography>
                {dato.url && (
                  <Box display={'flex'}>
                    <YouTube videoId={getYouTubeId(dato.url)} opts={{ width: '100%', height: '100%' }} />
                  </Box>
                )}
                {dato.file && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (dato.file.contentType.startsWith('image')) {
                        handleImageClick(`data:${dato.file.contentType};base64,${dato.file.data}`);
                      } else {
                        handleDownloadClick(`data:${dato.file.contentType};base64,${dato.file.data}`, dato.title);
                      }
                    }}
                  >
                    {dato.file.contentType.startsWith('image') ? 'Ver Imagen' : 'Descargar Archivo'}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
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
  );
}

export default Library;
