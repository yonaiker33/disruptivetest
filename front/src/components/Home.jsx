import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import { io } from 'socket.io-client';

function Home() {
  const [contents, setContents] = useState({ images: 0, videos: 0, texts: 0 });

  useEffect(() => {
    const socket = io("http://localhost:5000");
    console.log(socket)
    socket.on('contentChange', (change) => {
      console.log('Cambio en la colección contents recibido:', change);
      // Actualizar el estado de los contenidos
      fetchContents();
    });

    fetchContents(); // Llama a fetchContents una vez al inicio para obtener los contenidos iniciales

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchContents = () => {
    axios.get('/api/contents')
      .then(response => {
        setContents(response.data);
      })
      .catch(error => {
        console.error('Error fetching contents:', error);
      });
  };

  return (
    <Box mt={20} display={'flex'} alignItems={'center'} flexDirection={'column'}>
      {
        contents ?
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={10}>
          <Typography variant="h2" gutterBottom>Contenidos disponibles</Typography>
          <Box display={'flex'} justifyContent={'center'} gap={10}>
            {Object.entries(contents).map(([category, items]) => (
              <ContentCategory key={category} name={category} count={items.length} />
            ))}
          </Box>
        </Box>
        :
        <Typography variant="h4" mt={15} gutterBottom>No hay actualmente ningun contenido registrado</Typography>
      }
    </Box>
  );
}

function ContentCategory({ name, count }) {
  return (
    <Grid item xs={4}>
      <Box p={2} border={1} borderColor="primary.main"  minWidth={200}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body1">Disponibles: {count}</Typography>
      </Box>
    </Grid>
  );
}

export default Home;
