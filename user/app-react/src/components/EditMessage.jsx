import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditMessage = ({ user }) => {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ content: '' });

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/message/${messageId}`); 
        if (!res.ok) throw new Error('Erreur lors de la récupération du message');
        
        const data = await res.json();
        console.log('Message data:', data);
        
        if (data.content) {
          setMessage({ content: data.content });
        } else {
          console.error('Le message ne contient pas de propriété content:', data);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
  
    fetchMessage();
  }, [messageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...message, user: { _id: user._id, role: user.role } })
    });
  
    const data = await res.json();
  
    if (res.ok) {
      alert(data.msg);  // afficher message de succès venant du serveur
      navigate(`/topic/${data.messageUpdated.topic._id}`);  // rediriger vers le topic correspondant
    } else {
      alert(data.message); // afficher message d'erreur venant du serveur
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier le message</h2>

      <textarea
        name="content"
        value={message.content}
        onChange={handleChange}
        required
      />

      <br/>
      <button type="submit" className="btn block-cube block-cube-hover">
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Enregistrer</div>
      </button>

      <br/>
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

export default EditMessage;
