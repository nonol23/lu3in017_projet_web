import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PublicProfil.css';

function PublicProfil() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [topics, setTopics] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userRes, topicsRes, messagesRes] = await Promise.all([
                    fetch(`/api/users/${userId}/public`),
                    fetch(`/api/topics/user/${userId}`),
                    fetch(`/api/messages/user/${userId}`)
                ]);

                const [userData, topicsData, messagesData] = await Promise.all([
                    userRes.json(),
                    topicsRes.json(),
                    messagesRes.json()
                ]);

                setUser(userData);
                setTopics(topicsData);
                setMessages(messagesData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) return <div className="loading">Chargement...</div>;
    if (!user) return <div className="error">Utilisateur non trouvé</div>;

    return (
        <div className="public-profil-container">
            <h1>Activité de {user.identifiant}</h1>
            
            <button onClick={() => navigate(-1)} className="back-button">
                Retour
            </button>

            <div className="user-activity">
                <section className="topics-section">
                    <h2>Sujets créés ({topics.length})</h2>
                    {topics.length > 0 ? (
                        <ul className="topic-list">
                            {topics.map(topic => (
                                <li key={topic._id} className="topic-item">
                                    <h3>{topic.subject}</h3>
                                    <p className="topic-meta">
                                        Créé le {new Date(topic.createdAt).toLocaleDateString()} • 
                                        {topic.messages?.length || 0} messages
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun sujet créé</p>
                    )}
                </section>

                <section className="messages-section">
                    <h2>Messages postés ({messages.length})</h2>
                    {messages.length > 0 ? (
                        <ul className="message-list">
                            {messages.map(message => (
                                <li key={message._id} className="message-item">
                                    <p className="message-content">{message.content}</p>
                                    <p className="message-meta">
                                        Posté le {new Date(message.createdAt).toLocaleDateString()} dans 
                                        <span className="topic-link">{message.topic?.subject}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun message posté</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default PublicProfil;