// src/components/TopicDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';

const TopicDetail = ({ topics }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const topic = topics.find(t => t._id === id);  // Cherchez par _id
  console.log('Topic trouvé:', topic); // Ajoutez cette ligne

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
      <h1>{topic.subject}</h1>
      <p style={{ whiteSpace: 'pre-wrap' }}>{topic.content || 'Pas de contenu.'}</p>
      <p>
        <em>
          Créé par {topic.author?.prenom} le {topic.createdAt}
        </em>
      </p>
      <button onClick={() => navigate(-1)}>← Retour</button>
    </div>
  );
};

export default TopicDetail;
