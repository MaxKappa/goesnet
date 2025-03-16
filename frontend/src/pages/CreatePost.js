import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container, TextField, Button, Typography, Box, LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (photo) {
      formData.append('photo', photo);
    }
    api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      }
    })
      .then(() => {
        toast.success("Post pubblicato con successo! 🎉");
        navigate('/');
      })
      .catch(() => toast.error("Errore durante la pubblicazione 😢"));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Crea un nuovo Post</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Scrivi qui il contenuto del tuo post"
          required
          margin="normal"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {photo && (
          <Box mt={2}>
            <Typography variant="subtitle1">Anteprima Immagine:</Typography>
            <img 
              src={URL.createObjectURL(photo)} 
              alt="Anteprima" 
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} 
            />
          </Box>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box mt={2}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" align="center">{uploadProgress}%</Typography>
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Pubblica
        </Button>
      </Box>
    </Container>
  );
};

export default CreatePost;
