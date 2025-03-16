import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import InsertCommentRoundedIcon from '@mui/icons-material/InsertCommentRounded';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import api from '../utils/api';

const Post = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);


  useEffect(() => {
    api.get(`/comments?post_id=${post.id}`)
      .then((res) => setComments(res.data))
      .catch(() => {
        
      });
  }, [post.id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    api.post('/comments', { post_id: post.id, content: commentText })
      .then(() => {
        setCommentText("");

        return api.get(`/comments?post_id=${post.id}`);
      })
      .then((res) => setComments(res.data))
      .catch(() => {

      })
      .finally(() => setSubmitting(false));
  };
  const toggleExpanded = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <Card
      sx={{
        mt: 2,
        border: expanded ? '2px solid #3b82f6' : 'none'
      }}
    >
      <CardContent>
        <div className="flex items-center mb-2">
          <Link to={`/profile/${post.user?.id}`}>
            <img
              src={post.user?.profile_picture || '/default-avatar.png'}
              alt={post.user?.username}
              className="w-8 h-8 rounded-full mr-2"
            />
          </Link>
          <div>
            <Typography variant="subtitle2">
              <Link to={`/profile/${post.user?.id}`} className="text-inherit hover:underline">
                {post.user?.username}
              </Link>
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(post.created_at).toLocaleString()}
            </Typography>
          </div>
        </div>
        <Typography>{post.content}</Typography>
     
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Immagine del post"
            className="mt-2 max-h-96 w-full object-cover rounded"
          />
        )}
        <div className="flex items-center mt-2">
          <LikeButton postId={post.id} />
          <IconButton size="small" onClick={toggleExpanded}>
            <InsertCommentRoundedIcon />
          </IconButton>
          {comments.length > 0 && (
            <span className="ml-1 text-sm text-gray-600">{comments.length}</span>
          )}
        </div>
        {expanded && (
          <div className="mt-2">
            <div className="mt-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-t pt-2 mt-2 flex items-start"
                  >
                    <img
                      src={comment.user?.profile_picture || '/default-avatar.png'}
                      alt={comment.user?.username}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <div>
                      <Typography variant="subtitle2">
                        {comment.user?.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">{comment.content}</Typography>
                    </div>
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" className="mt-2">
                  Nessun commento.
                </Typography>
              )}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex items-center mt-2">
              <input 
                type="text" 
                placeholder="Scrivi un commento..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1 mr-2"
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-3 py-1 rounded"
                disabled={submitting}
              >
                {submitting ? "Invio..." : "Invia"}
              </button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Post;
