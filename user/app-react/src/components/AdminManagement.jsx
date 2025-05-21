import { useEffect } from 'react';
import '../styles/AdminManagement.css';

const AdminManagement = ({ users, setUsers }) => {
  useEffect(() => {
    fetch('http://localhost:5000/api/users/all')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Erreur lors du chargement des utilisateurs :", err));
  }, [setUsers]);

  const toggleAdminStatus = async (userId) => {
    const updatedUser = users.find(user => user._id === userId);
    const newRole = updatedUser.role === 'admin' ? 'user' : 'admin';

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const updated = await res.json();
      setUsers(users.map(u => (u._id === updated._id ? updated : u)));
    } catch (err) {
      console.error("Erreur lors du changement de rôle :", err);
    }
  };

  return (
    <div className="user-management">
      <div className="user-list">
        {users.map(user => (
          <div key={user._id} className="user-item">
            <div className="user-info">
              <span>{user.prenom} {user.nom}</span>
              <span className="user-email">{user.email}</span>
              <span className={`user-role ${user.role}`}>
                ({user.role === 'admin' ? 'Admin' : 'User'})
              </span>
            </div>
            <button
              onClick={() => toggleAdminStatus(user._id)}
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
