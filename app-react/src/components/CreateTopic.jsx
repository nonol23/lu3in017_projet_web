import React, { useState } from 'react';

const CreateTopic = ({ onCancelClick, onSubmit }) => {
  const [topicName, setTopicName] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topicName.trim() && content.trim()) {
      onSubmit({ topicName, content });
      setTopicName('');
      setContent('');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="control">
        <h1>Créer un sujet</h1>
      </div>

      <div className="control block-cube block-input">
        <input
          id="titre"
          type="text"
          placeholder="Nom du sujet"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          required
        />
        <input
          id="contenu"
          type="text"
          placeholder="Contenu du sujet"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <button className="btn block-cube block-cube-hover" type="submit">
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Créer</div>
      </button>

      <button
        type="button"
        className="btn block-cube block-cube-hover"
        onClick={onCancelClick}
        style={{ marginTop: '10px' }}
      >
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Annuler</div>
      </button>
    </form>
  );
};

export default CreateTopic;
