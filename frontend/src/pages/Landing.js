import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <Container
      maxWidth="sm"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: '16px'
      }}
    >
      <Typography variant="h3" gutterBottom>
        Benvenuto su GoesNet
      </Typography>
      <Typography variant="body1" gutterBottom>
        Accedi o registrati per vedere i post e interagire con la community.
      </Typography>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ textDecoration: 'none', marginRight: '16px' }}>
          <Button variant="contained" color="primary">
            Login
          </Button>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="secondary">
            Registrati
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Landing;
