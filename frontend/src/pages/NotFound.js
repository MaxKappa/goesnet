import React, { useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Pagina non trovata! ❌", { autoClose: 3000 });
  }, []);

  return (
    <Container
      maxWidth="sm"
      style={{
        textAlign: 'center',
        marginTop: '50px',
      }}
    >
      <Typography variant="h2" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! La pagina che cerchi non esiste. 😢
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Torna alla Home
      </Button>
    </Container>
  );
};

export default NotFound;
