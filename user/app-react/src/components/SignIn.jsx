import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Connexion.css';

function SignIn({ onCancelClick, onSuccess }) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [mdp, setMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("Formulaire soumis"); 
    if (mdp !== confirmMdp) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prenom, 
          nom, 
          email, 
          identifiant, 
          mdp,
          confirmMdp,
          role: email === 'admin@example.com' ? 'admin' : 'user'
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
  
      alert("Inscription soumise pour validation");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" autoComplete="off" onSubmit={handleSignIn}>
      <div className="control">
        <h1>S'inscrire</h1>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="control block-cube block-input">
        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          type="text"
          placeholder="Identifiant"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          type="password"
          placeholder="Mot de passe"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
        />
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
      </div>

      <div className="control block-cube block-input">
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmMdp}
          onChange={(e) => setConfirmMdp(e.target.value)}
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
        <div className="text">S'inscrire</div>
      </button>

      <button
        className="btn block-cube block-cube-hover"
        type="button"
        onClick={() => navigate('/login')}
        style={{ marginTop: '15px' }}
      >
        <div className="bg-top"><div className="bg-inner" /></div>
        <div className="bg-right"><div className="bg-inner" /></div>
        <div className="bg"><div className="bg-inner" /></div>
        <div className="text">Annuler</div>
      </button>
    </form>
  );
}

export default SignIn;
