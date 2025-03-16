import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { Container, Typography, ButtonGroup, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import Post from '../components/Post';

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("followed"); 


  useEffect(() => {
    api.get('/posts')
      .then((response) => setPosts(response.data))
      .catch((err) =>
        setError(err.response ? err.response.data.error : 'Errore di connessione')
      );
  }, []);


  useEffect(() => {
    if (auth && auth.user && auth.user.id) {
      api.get(`/follows/${auth.user.id}/following`)
        .then((res) => {
          const ids = (res.data || []).map(user => user.id);
          setFollowingIds(ids);
        })
        .catch(() => {});
    }
  }, [auth]);

 
  useEffect(() => {
    if (posts.length > 0 && followingIds.length > 0) {
      const filtered = posts.filter(post => followingIds.includes(post.user?.id));
      setFollowedPosts(filtered);
    } else {
      setFollowedPosts([]);
    }
  }, [posts, followingIds]);

  const renderSection = () => {
    if (activeSection === "followed") {
      return (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Post delle persone che segui
          </Typography>
          {followedPosts.length === 0 ? (
            <Typography>Nessun post dalle persone che segui.</Typography>
          ) : (
            followedPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          )}
        </>
      );
    } else if (activeSection === "all") {
      return (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
            Tutti i post
          </Typography>
          {posts.length === 0 ? (
            <Typography>Nessun post disponibile</Typography>
          ) : (
            posts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          )}
        </>
      );
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Home</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <ButtonGroup variant="contained" sx={{ mt: 2 }}>
        <Button 
          onClick={() => setActiveSection("followed")} 
          color={activeSection === "followed" ? "primary" : "inherit"}
        >
          Post dei seguiti
        </Button>
        <Button 
          onClick={() => setActiveSection("all")} 
          color={activeSection === "all" ? "primary" : "inherit"}
        >
          Tutti i post
        </Button>
      </ButtonGroup>

      {renderSection()}
    </Container>
  );
};

export default Home;
