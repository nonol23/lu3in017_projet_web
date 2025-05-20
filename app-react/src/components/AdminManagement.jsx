import React, { useState, useEffect } from 'react';
import '../styles/AdminManagement.css';

const AdminManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Récupération des utilisateurs depuis le localStorage
    const loadedUsers = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('user_')) {
        const user = JSON.parse(localStorage.getItem(key));
        loadedUsers.push(user);
      }
    }
    setUsers(loadedUsers);
  }, []);

  const toggleAdminStatus = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.identifiant === userId) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        return { ...user, role: newRole };
      }
      return user;
    });

    // Mise à jour du localStorage
    updatedUsers.forEach(user => {
      localStorage.setItem(`user_${user.identifiant}`, JSON.stringify(user));
    });

    setUsers(updatedUsers);
  };

  return (
    <div className="user-management">
      <div className="user-list">
        {users.map(user => (
          <div key={user.identifiant} className="user-item">
            <div className="user-info">
              <span>{user.prenom} {user.nom}</span>
              <span className="user-email">{user.email}</span>
              <span className={`user-role ${user.role}`}>
                ({user.role === 'admin' ? 'Admin' : 'User'})
              </span>
            </div>
            <button
              onClick={() => toggleAdminStatus(user.identifiant)}
              className={user.role === 'admin' ? 'revoke-btn' : 'promote-btn'}
            >
              {user.role === 'admin' ? 'Rétrograder' : 'Promouvoir Admin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminManagement;