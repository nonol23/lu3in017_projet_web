import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopicDetails = ({ topics }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const topic = topics.find(t => t._id === id);  // Cherchez par _id
  console.log('Topic trouvé:', topic); // Ajoutez cette ligne

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Erreur chargement messages:', err);
        setError('Erreur lors du chargement des messages');
      }
    };

    if (id) fetchMessages();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          topicId: id,
          authorId: user?._id // Envoyez l'ID utilisateur depuis le contexte
        })
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création du message');
      }

      const data = await res.json();

      if (!data.author?.prenom && user?.prenom) {
        data.author = { prenom: user.prenom };
      }

      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Erreur envoi message:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!topic) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Sujet introuvable</h2>
        <button onClick={() => navigate(-1)}>← Retour</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)}>← Retour</button>
      <h1>{topic.subject}</h1>
      <p style={{ whiteSpace: 'pre-wrap' }}>{topic.content || 'Pas de contenu.'}</p>
      <p>
        <em>
          Créé par {topic.author?.prenom} le {topic.createdAt}
        </em>
      </p>
      <h2>Commentaires ({messages.length})</h2>
      
      {user && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={3}
            style={{ width: '100%', padding: '0.5rem' }}
            required
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()}
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? 'Envoi en cours...' : 'Publier le commentaire'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      <div>
        {messages.length === 0 ? (
          <p>Aucun commentaire pour le moment.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((message) => (
              <li key={message._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee' }}>
                <p style={{color: "grey"}}>{message.content}</p>
                <small style={{color: "grey"}}>
                  Par {message.author?.prenom} le {new Date(message.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
};

export default TopicDetails;
