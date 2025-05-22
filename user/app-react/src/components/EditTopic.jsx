import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTopic = ({ user, refreshTopics }) => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState({ subject: '', content: '' });

  useEffect(() => {
    const fetchTopic = async () => {
      const res = await fetch(`http://localhost:5000/api/topics/${topicId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setTopic({ subject: data.subject, content: data.content });
    };

    fetchTopic();
  }, [topicId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopic((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          ...topic, 
          user: { _id: user._id, role: user.role } 
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Sujet modifié');
        // Rafraîchir la liste des topics si la fonction est disponible
        if (typeof refreshTopics === 'function') {
          await refreshTopics();
        }
        navigate(`/topic/${topicId}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      alert('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier le sujet</h2>

      <input
        name="subject"
        value={topic.subject}
        onChange={handleChange}
        placeholder="Titre"
        required
      />

      <textarea
        name="content"
        value={topic.content}
        onChange={handleChange}
        placeholder="Contenu"
        required
      />

      <button type="submit" className="btn block-cube block-cube-hover">
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Enregistrer</div>
      </button>

      <button
        type="button"
        className="btn block-cube block-cube-hover"
        onClick={() => navigate(-1)}
      >
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Annuler</div>
      </button>
    </form>
  );
};

export default EditTopic;
