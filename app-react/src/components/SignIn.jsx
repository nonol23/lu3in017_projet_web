
import Button from "./Button";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Connexion.css'; // Assurez-vous d'importer le même CSS que pour Login

function SignIn({ onCancelClick, onSuccess }) {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [identifiant, setIdentifiant] = useState('');
    const [mdp, setMdp] = useState('');
    const [confirmMdp, setConfirmMdp] = useState('');
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        if (mdp !== confirmMdp) {
          alert("Les mots de passe sont différents !");
          return;
        }
    
        const user = { prenom, nom, email, identifiant, mdp };
        localStorage.setItem('user', JSON.stringify(user));
        onSuccess(user); // Appelé après inscription réussie
    };

    return (
        <form className="form" autocomplete="off" onSubmit={handleSignIn}>
            <div className="control">
                <h1>S'inscrire</h1>
            </div>

            {/* Prénom */}
            <div className="control block-cube block-input">
                <input
                    type="text"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                />
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
            </div>

            {/* Nom */}
            <div className="control block-cube block-input">
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
            </div>

            {/* Email */}
            <div className="control block-cube block-input">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
            </div>

            {/* Identifiant */}
            <div className="control block-cube block-input">
                <input
                    type="text"
                    placeholder="Identifiant"
                    value={identifiant}
                    onChange={(e) => setIdentifiant(e.target.value)}
                    required
                />
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
            </div>

            {/* Mot de passe */}
            <div className="control block-cube block-input">
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)}
                    required
                />
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
            </div>

            {/* Confirmation mot de passe */}
            <div className="control block-cube block-input">
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmMdp}
                    onChange={(e) => setConfirmMdp(e.target.value)}
                    required
                />
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
            </div>

            {/* Boutons */}
            <button className="btn block-cube block-cube-hover" type="submit">
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
                <div className="text">S'inscrire</div>
            </button>

            <button 
                className="btn block-cube block-cube-hover" 
                type="button"
                onClick={() => navigate('/login')} // Navigation directe
                style={{ marginTop: '15px' }}
            >
                <div className="bg-top"><div className="bg-inner"></div></div>
                <div className="bg-right"><div className="bg-inner"></div></div>
                <div className="bg"><div className="bg-inner"></div></div>
                <div className="text">Annuler</div>
            </button>
        </form>
    );
}

export default SignIn;


