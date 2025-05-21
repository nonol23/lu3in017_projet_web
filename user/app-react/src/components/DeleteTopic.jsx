import React from 'react';

const DeleteTopic = ({ topic, onDelete}) => {
  return (
    <div className="admin-actions" style={{
      display: 'flex',
      gap: '8px',
      marginLeft: '10px'
    }}>
      <button
        onClick={() => onDelete(topic.id)}
        className="delete-btn"
        style={{
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
      >
        Supprimer
      </button>
      
    </div>
  );
};

export default DeleteTopic;