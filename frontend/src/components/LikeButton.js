import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchLikeData = () => {
    api.get(`/likes/${postId}`)
      .then((res) => setLikeCount(res.data.likes))
      .catch(() => { toast.error("Errore nel recupero dei likes")});

    api.get(`/likes/${postId}/me`)
      .then((res) => setLiked(res.data.liked))
      .catch(() => { toast.error("Errore nel like") });
  };

  useEffect(() => {
    fetchLikeData();
  }, [postId]);

  const handleLike = () => {
    if (liked) {
      api.delete(`/likes/${postId}`)
        .then(() => {
          setLiked(false);
          fetchLikeData();
        })
        .catch(() => toast.error("Errore durante l'unlike"));
    } else {
      api.post(`/likes/${postId}`)
        .then(() => {
          setLiked(true);
          fetchLikeData();
        })
        .catch(() => toast.error("Errore durante il like"));
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button onClick={handleLike} className="text-xl focus:outline-none">
        {liked ? <span className="text-red-500">♥</span> : <span className="text-gray-500">♡</span>}
      </button>
      <span className="text-sm text-gray-600">{likeCount}</span>
    </div>
  );
};

export default LikeButton;
