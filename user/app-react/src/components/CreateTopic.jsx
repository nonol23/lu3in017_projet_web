import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CreateTopic = ({ onCancelClick, onSubmit }) => {
  const { user } = useAuth();
  const [topicName, setTopicName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation client
    if (!topicName.trim() || !content.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topicName,
          content,
          userId: user._id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }

      const data = await response.json();
      
      // Réinitialisation après succès
      setTopicName('');
      setContent('');
      
      if (onSubmit) {
        onSubmit(data.topic);
      }
      
      // Navigation seulement après succès
      navigate(-1);
      
    } catch (err) {
      console.error("Erreur création topic:", err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="control">
        <h1>Créer un sujet</h1>
        {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
      </div>

      <div className="control block-cube block-input">
        <input
          id="titre"
          type="text"
          placeholder="Nom du sujet"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          id="contenu"
          placeholder="Contenu du sujet"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isSubmitting}
          rows={5}
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="button-group">
        <button 
          className="btn block-cube block-cube-hover" 
          type="submit"
          disabled={isSubmitting}
        >
          <div className="bg-top"><div className="bg-inner" /></div>
          <div className="bg-right"><div className="bg-inner" /></div>
          <div className="bg"><div className="bg-inner" /></div>
          <div className="text">
            {isSubmitting ? 'Création en cours...' : 'Créer'}
          </div>
        </button>

        <button
          type="button"
          className="btn block-cube block-cube-hover"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <div className="bg-top"><div className="bg-inner" /></div>
          <div className="bg-right"><div className="bg-inner" /></div>
          <div className="bg"><div className="bg-inner" /></div>
          <div className="text">Annuler</div>
        </button>
      </div>
    </form>
  );
};

export default CreateTopic;