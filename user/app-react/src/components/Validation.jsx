import React, { useEffect, useState } from 'react';

function Validation() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/pending-users');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs en attente", error);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleReject = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/reject-user/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Erreur lors du refus", error);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/validate-user/${userId}`, { method: 'POST' });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Erreur lors de la validation", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Demandes d'inscription</h2>
      {users.length === 0 ? (
        <p>Aucune demande en attente</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(user => (
            <li key={user._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              margin: '10px 0',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{user.prenom} {user.nom}</p>
                <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleAccept(user._id)} style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}>✓</button>
                <button onClick={() => handleReject(user._id)} style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}>✗</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Validation;
