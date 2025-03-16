import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ErrorAlert from '../components/ErrorAlert';

const Comments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const fetchComments = () => {
    api.get(`/comments?post_id=${postId}`)
      .then((response) => setComments(response.data))
      .catch((err) =>
        setError(err.response ? err.response.data.error : 'Errore di connessione')
      );
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/comments', { post_id: postId, content })
      .then(() => {
        setContent('');
        fetchComments();
      })
      .catch((err) =>
        setError(err.response ? err.response.data.error : 'Errore di connessione')
      );
  };

  return (
    <div>
      <h2>Commenti</h2>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Aggiungi un commento..."
          required
          style={{ width: '100%', height: '100px' }}
        />
        <button type="submit">Invia Commento</button>
      </form>
      <div>
        {comments.map((comment) => (
          <div key={comment.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
