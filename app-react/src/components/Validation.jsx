
import React, { useState } from 'react';

function Validation() {
  // État initial avec les données fictives
  const [users, setUsers] = useState([
    { prenom: "Jean", nom: "Dupont", email: "jean@exemple.com", id: 1 },
    { prenom: "Marie", nom: "Martin", email: "marie@exemple.com", id: 2 }
  ]);

  // Fonction pour gérer le refus
  const handleReject = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#333' }}>Demandes d'inscription</h2>
      
      {users.length === 0 ? (
        <p>Aucune demande en attente</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li key={user.id} style={{
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
                <p style={{ margin: '0', fontWeight: 'bold' }}>
                  {user.prenom} {user.nom}
                </p>
                <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Bouton Valider (vert) */}
                <button style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✓
                </button>
                
                {/* Bouton Refuser (rouge) */}
                <button 
                  onClick={() => handleReject(user.id)}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✗
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Validation;