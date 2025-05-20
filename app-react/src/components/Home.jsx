import { useNavigate } from 'react-router-dom';

const Home = ({ user, onLogout, topics }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenue {user.prenom}</h1>
      
      <div className="action-buttons">
        <button onClick={onLogout}>Déconnexion</button>
        <button onClick={() => navigate('/profil')}>Profil</button>
        <button onClick={() => navigate('/create-topic')}>Créer un sujet</button>
      </div>

      <h2>Sujets de discussion</h2>
      {topics.length === 0 ? (
        <p>Aucun sujet pour le moment.</p>
      ) : (
        <ul className="topics-list">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button 
                onClick={() => navigate(`/topic/${topic.slug}`)}
                className="topic-button"
              >
                {topic.name} (créé par {topic.createdBy})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;