import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopicDetails = ({ topics }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loadingTopic, setLoadingTopic] = useState(true);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/topic/${id}`); // Correspond à la nouvelle route
        if (!res.ok) throw new Error('Erreur lors du chargement des messages');
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur chargement messages:', err);
        setError('Erreur lors du chargement des messages');
      }
    };
  
    if (id) fetchMessages();
  }, [id]);
  
  // Et pour trouver le topic :
  useEffect(() => {
    const fetchTopic = async () => {
      setLoadingTopic(true);
      try {
        const res = await fetch(`http://localhost:5000/api/topics/${id}`);
        if (!res.ok) throw new Error('Erreur chargement sujet');
        const data = await res.json();
        setTopic(data);
      } catch (err) {
        console.error(err);
        setTopic(null);
      } finally {
        setLoadingTopic(false);
      }
    };
    if (id) fetchTopic();
  }, [id]);
  console.log('Topic trouvé:', topic); // Ajoutez cette ligne

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
      <button onClick={() => navigate('/')}>← Retour</button>
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
                  Par <Link to={`/public-profil/${message.author?._id}`}> {message.author?.prenom} </Link> 
                   le {new Date(message.createdAt).toLocaleString()}
                  
                </small>
                <button onClick={() => navigate(`/edit-message/${message._id}`)}>🖋️</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
};

export default TopicDetails;
