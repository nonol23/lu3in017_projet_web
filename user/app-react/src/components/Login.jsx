import Button from "./Button"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Connexion.css';
import { useAuth } from '../contexts/AuthContext';

function Login({ onLoginSuccess }) {
  const [identifiant, setIdentifiant] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiant, mdp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      alert(data.message); // "Connexion réussie"
      onLoginSuccess(data.user);

      setUser(data.user); // <- Stocke l'utilisateur dans le contexte
      navigate('/');  // redirection vers Home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" autoComplete="off" onSubmit={handleLogin}>
      <div className="control">
        <h1>Se connecter</h1>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="control block-cube block-input">
        <input
          name="username"
          type="text"
          placeholder="Identifiant"
          value={identifiant}
          onChange={e => setIdentifiant(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={mdp}
          onChange={e => setMdp(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <button className="btn block-cube block-cube-hover" type="submit">
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Se connecter</div>
      </button>

      <button
        className="btn block-cube block-cube-hover"
        type="button"
        onClick={() => navigate('/signin')}
        style={{ marginTop: '15px' }}
      >
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">S'inscrire</div>
      </button>
    </form>
  );
}

export default Login;
