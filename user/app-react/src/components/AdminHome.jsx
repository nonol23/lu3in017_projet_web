import { useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Validation from "./Validation";
import DeleteTopic from "./DeleteTopic";
import AdminManagement from "./AdminManagement"
import '../styles/DeleteTopic.css';


const AdminHome = ({ user, onLogout, topics, setTopics}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [topicToDelete, setTopicToDelete] = useState(null);


  if (user?.role !== 'admin') {return <Navigate to="/" />;}

  const handleDeleteTopic = async () => {
    if (!topicToDelete) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${topicToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            _id: user._id,
            role: user.role
          }
        })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setTopics(topics.filter(topic => topic._id !== topicToDelete._id));
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du sujet :", err);
    } finally {
      setTopicToDelete(null); // ferme la modale
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
        <AdminManagement users={users} setUsers={setUsers} />
      </div>

      <h2>Sujets de discussion</h2>
        {topics.length === 0 ? (
            <p>Aucun sujet pour le moment.</p>
        ) : (
            <ul className="topics-list">
            {topics.map((topic) => (
                <li key={topic._id} style={{
                display: 'flex',
                alignItems: 'center',
                margin: '10px 0'
                }}>
                <button 
                    onClick={() => navigate(`/topic/${topic.slug}`)}
                    className="topic-button"
                    style={{ flex: 1, textAlign: 'left' }}
                >
                    {topic.subject} (créé par {topic.author?.prenom})
                </button>
                
                <DeleteTopic onDelete={() => setTopicToDelete(topic)}/>
                </li>
            ))}
            </ul>
        )}
        {topicToDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Voulez-vous vraiment supprimer le sujet <strong>{topicToDelete.subject}</strong> ?</p>
              <button onClick={handleDeleteTopic}>Oui, supprimer</button>
              <button onClick={() => setTopicToDelete(null)}>Annuler</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminHome;