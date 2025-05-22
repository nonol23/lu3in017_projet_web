import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Profil.css';
import { useAuth } from '../contexts/AuthContext';
import DeleteTopic from "./DeleteTopic";
import DeleteMessage from "./DeleteMessage";
import '../styles/DeleteTopic.css';


function Profil({ user, onUpdate, onPasswordChange, topics, setTopics }) {
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [userMessages, setUserMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userTopics, setUserTopics] = useState([]);
    const [topicsLoading, setTopicsLoading] = useState(true);
    const [formData, setFormData] = useState({
        identifiant: user.identifiant,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [topicToDelete, setTopicToDelete] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Charger les messages
                const messagesResponse = await fetch(`http://localhost:5000/api/messages/user/${user._id}`);
                const messagesData = await messagesResponse.json();
                setUserMessages(messagesData);
                
                // Charger les topics
                const topicsResponse = await fetch(`http://localhost:5000/api/topics/user/${user._id}`);
                const topicsData = await topicsResponse.json();
                setUserTopics(topicsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                setTopicsLoading(false);
            }
        };

        if (user._id) {
            fetchUserData();
        }
    }, [user._id]);

    const handlePasswordChangeInput = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
    
            const updatedUser = await res.json();
    
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                onUpdate(updatedUser);
                setIsUpdating(false);
                alert("Profil mis à jour avec succès !");
            } else {
                alert(updatedUser.message || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            console.error("Erreur mise à jour:", err);
            alert("Erreur lors de la mise à jour du profil");
        }
    };
    

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
    
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Les nouveaux mots de passe ne correspondent pas !");
            return;
        }
    
        try {
            const res = await fetch(`http://localhost:5000/api/users/${user._id}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                })
            });
    
            const updatedUser = await res.json();
            console.log('Response ok?', res.ok, updatedUser);
    
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                onPasswordChange({ ...passwordData });
                setIsChangingPassword(false);
                alert("Mot de passe modifié !");
            } else {
                alert(updatedUser.message || "Erreur lors du changement de mot de passe");
            }
        } catch (err) {
            console.error("Erreur changement mot de passe:", err);
            alert("Erreur lors du changement de mot de passe");
        }
    };
    
    

    const handleReturnHome = () => {
        navigate('/');
    };



    useEffect(() => {
        if (topics && user._id) {
            const filteredTopics = topics.filter(topic => topic.author?._id === user._id);
            setUserTopics(filteredTopics);
        }
    }, [topics, user._id]);

    const handleDeleteTopic = async () => {
        if (!topicToDelete) return;
      
        try {
            const res = await fetch(`http://localhost:5000/api/topics/${topicToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                // Mise à jour de la liste locale
                setUserTopics(prev => prev.filter(topic => topic._id !== topicToDelete._id));
                
                // Mise à jour de la liste globale si disponible
                if (setTopics) {
                    setTopics(prev => prev.filter(topic => topic._id !== topicToDelete._id));
                }
                
                // Rafraîchissement complet si disponible (avec vérification d'existence)
                if (typeof refreshTopics === 'function') {
                    await refreshTopics();
                } else {
                    // Fallback: recharge les données utilisateur si refreshTopics n'est pas disponible
                    const topicsResponse = await fetch(`http://localhost:5000/api/topics/user/${user._id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const topicsData = await topicsResponse.json();
                    setUserTopics(topicsData);
                }
                
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression du sujet :", err);
            alert("Une erreur est survenue lors de la suppression");
        } finally {
            setTopicToDelete(null);
        }
    };

      

    const handleDeleteUserMessage = async (messageId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
          try {
            const res = await fetch(`http://localhost:5000/api/messages/user/${messageId}`,{
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
              setUserMessages(prev => prev.filter(message => message._id !== messageId));
              alert(data.message);
            } else {
              alert(data.message);
            }
          } catch (err) {
            console.error("Erreur lors de la suppression du sujet :", err);
          }
        }
    };
      

    return (
        <div className="profil-container">
            <h1>Profil de {user.identifiant}</h1>

            
            {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                    <div className="password-change-form">
                        <div className="block-cube-prof">
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            
                            <p>
                                <label>Ancien mot de passe:</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChangeInput}
                                    required
                                />
                            </p>
                            <p>
                                <label>Nouveau mot de passe:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChangeInput}
                                    required
                                />
                            </p>
                            <p>
                                <label>Confirmer le nouveau mot de passe:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChangeInput}
                                    required
                                />
                            </p>
                        </div>
                        <div className="action-buttons">
                            <button type="submit" className="block-cube-prof">
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Enregistrer</div>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsChangingPassword(false)} 
                                className="block-cube-prof"
                            >
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Annuler</div>
                            </button>
                        </div>
                    </div>
                </form>
            ) : isUpdating ? (
                <form onSubmit={handleSubmit}>
                    <div className="informations">
                        <div className="block-cube-prof">
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            <p>
                            <span className="info-label">Identifiant:</span>
                                <input 
                                    name="identifiant"
                                    value={formData.identifiant}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                            <p>
                            <span className="info-label">Prénom:</span>
                                <input 
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                            <p>
                            <span className="info-label">Nom:</span>
                                <input 
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                            <p>
                            <span className="info-label">Email:</span>
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                        </div>
                        <div className="action-buttons">
                            <button type="submit" className="block-cube-prof">
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Enregistrer</div>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsUpdating(false)} 
                                className="block-cube-prof"
                            >
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Annuler</div>
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="informations">
                    <div className="block-cube-prof">
                        <div className="bg-top-prof"></div>
                        <div className="bg-right-prof"></div>
                        <div className="bg-prof"></div>
                        <p>
                            <span className="info-label">Identifiant:</span>
                            <span className="info-value">{user.identifiant}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                        <p>
                            <span className="info-label">Prénom:</span>
                            <span className="info-value">{user.prenom}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                        <p>
                            <span className="info-label">Nom:</span>
                            <span className="info-value">{user.nom}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                        <p>
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user.email}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                    </div>
                    <div className="action-buttons">
                        <button 
                            onClick={() => setIsChangingPassword(true)}
                            className="password-change-btn block-cube-prof"
                        >
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            <div className="text-prof">Modifier le mot de passe</div>
                        </button>
                        <button 
                            onClick={handleReturnHome} 
                            className="block-cube-prof"
                        >
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            <div className="text-prof">Retour à l'accueil</div>
                        </button>
                    </div>
                </div>
            )}
            {/* Section Topics */}
            <div className="topics-section">
            <h2>Mes sujets</h2>
            {topicsLoading ? (
            <p>Chargement...</p>
            ) : userTopics.length === 0 ? (
            <p>Vous n'avez créé aucun sujet.</p>
            ) : (
                <ul className="topics-list">
                {userTopics.map(topic => (
                    <li key={topic._id} style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate(`/topic/${topic.slug}`)}
                            style={{ flex: 1, textAlign: 'left' }}
                        >
                            {topic.subject}
                        </button>
                        <button onClick={() => navigate(`/edit-topic/${topic._id}`)}>Modifier</button>
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
            
            {/* Section Messages */}
            <div className="messages-section">
                <h2>Mes messages</h2>
                {loading ? (
                    <p>Chargement des messages...</p>
                ) : userMessages.length > 0 ? (
                    <ul className="message-list">
                        {userMessages.map(message => (
                            <li key={message._id} className="message-item">
                                <div className="message-content">
                                    <p>{message.content}</p>
                                    <div className="message-meta">
                                        <span className="message-date">
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </span>
                                        {message.topic && (
                                            <span className="message-topic">
                                                Dans : {message.topic?.subject}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => navigate(`/edit-message/${message._id}`)}>Modifier</button>
                                <DeleteMessage message={message} onDelete={handleDeleteUserMessage} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Vous n'avez posté aucun message pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default Profil;