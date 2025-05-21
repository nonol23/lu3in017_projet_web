import { useNavigate, Link } from 'react-router-dom';
import SearchBar from "./SearchBar";

const Home = ({ user, onLogout, topics }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenue {user.prenom}</h1>

      <SearchBar currentUser={user} />
      
      <div className="action-buttons">

        <button onClick={onLogout}>Déconnexion</button>
        <br />
        <button onClick={() => navigate('/profil')}>Profil</button>
        <br />
        <button onClick={() => navigate('/create-topic')}>Créer un sujet</button>

        {user?.role?.toLowerCase() === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              style={{ 
                backgroundColor: '#4CAF50', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span></span> Espace Admin
            </button>
          )}
        </div>

      <h2>Sujets de discussion</h2>
      {topics.length === 0 ? (
        <p>Aucun sujet pour le moment.</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic._id}>
              <Link to={`/topic/${topic._id}`}>  {/* Utilisez _id au lieu de slug */}
                <strong>{topic.subject}</strong>
              </Link>
              (créé par {topic.author?.prenom} le  {new Date(topic.createdAt).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
