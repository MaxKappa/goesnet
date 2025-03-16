import React from 'react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div
      style={{
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        margin: '1rem 0',
        borderRadius: '5px',
        position: 'relative',
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'transparent',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
        }}
      >
        ×
      </button>
    </div>
  );
};

export default ErrorAlert;
