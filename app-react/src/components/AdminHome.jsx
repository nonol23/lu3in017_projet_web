import { useNavigate } from 'react-router-dom';
import Validation from "./Validation";
import DeleteTopic from "./DeleteTopic";
import AdminManagement from "./AdminManagement"


const AdminHome = ({ user, onLogout, topics, setTopics}) => {
  const navigate = useNavigate();
  if (user?.role !== 'admin') {return <Navigate to="/" />;}

  const handleDeleteTopic = (topicId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce sujet ?")) {
      const updatedTopics = topics.filter(topic => topic.id !== topicId);
      setTopics(updatedTopics);
      
      if (user?.username) {
        localStorage.setItem(`topics_${user.username}`, JSON.stringify(updatedTopics));
      }
    }
  };

  return (
    <div className="home-container">
      <h1>Bienvenue Admin {user.prenom}</h1>
      
      <div className="action-buttons">
        <button onClick={onLogout}>Déconnexion</button>
        <button onClick={() => navigate('/profil')}>Profil</button>
        <button onClick={() => navigate('/create-topic')}>Créer un sujet</button>
      </div>
      <div className="validation-section">
          <h2>Validation des inscriptions</h2>
          <Validation />
      </div>

      <div className="user-management-section">
        <h2>Gestion des Utilisateurs</h2>
        <AdminManagement />
      </div>

      <h2>Sujets de discussion</h2>
        {topics.length === 0 ? (
            <p>Aucun sujet pour le moment.</p>
        ) : (
            <ul className="topics-list">
            {topics.map((topic) => (
                <li key={topic.id} style={{
                display: 'flex',
                alignItems: 'center',
                margin: '10px 0'
                }}>
                <button 
                    onClick={() => navigate(`/topic/${topic.slug}`)}
                    className="topic-button"
                    style={{ flex: 1, textAlign: 'left' }}
                >
                    {topic.name} (créé par {topic.createdBy})
                </button>
                
                <DeleteTopic
                    topic={topic}
                    onDelete={handleDeleteTopic}
                />
                </li>
            ))}
            </ul>
        )}
    </div>
  );
};

export default AdminHome;