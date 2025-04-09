import Button from "./Button"
import React, { useState } from 'react';
import '../styles/Connexion.css';

function Login({ onSignInClick, onLoginSuccess }) {
    const [identifiant, setIdentifiant] = useState('');
    const [mdp, setMdp] = useState('');

    const getIdentifiant = (evt) => { setIdentifiant(evt.target.value) };
    const getMdp = (evt) => { setMdp(evt.target.value) };

    const handleLogin = (e) => {
        e.preventDefault();
        
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (user && user.identifiant === identifiant && user.mdp === mdp) {
          onLoginSuccess(user); // Appelé quand la connexion réussit
        } else {
          alert("Identifiant ou mot de passe incorrect !");
        }
    };

    return (
        //formulaire
        <form className="form" autocomplete="off" onSubmit={handleLogin}>
            <div className="control">
                <h1>Se connecter</h1>
            </div>


            {/*identifiant */}
            <div className="control block-cube block-input">
                <input 
                    name="username" 
                    type="text" 
                    placeholder="Identifiant"
                    id="identifiant"
                    value={identifiant}
                    onChange={getIdentifiant}
                    required
                />
                <div className="bg-top">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg-right">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg">
                    <div className="bg-inner"></div>
                </div>
            </div>


            {/*mot de passe */}
            <div className="control block-cube block-input">
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Mot de passe"
                    id="mdp"
                    value={mdp}
                    onChange={getMdp}
                    required
                />
                <div className="bg-top">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg-right">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg">
                    <div className="bg-inner"></div>
                </div>
            </div>
            
            {/*bouton pour se connecter */}
            <button className="btn block-cube block-cube-hover" type="submit">
                <div className="bg-top">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg-right">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg">
                    <div className="bg-inner"></div>
                </div>
                <div className="text">Se connecter</div>
            </button>

            {/* bouton d'inscription */}
            <button 
                className="btn block-cube block-cube-hover" 
                type="button"
                onClick={onSignInClick}
                style={{ marginTop: '15px' }}
            >
                <div className="bg-top">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg-right">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg">
                    <div className="bg-inner"></div>
                </div>
                <div className="text">S'inscrire</div>
            </button>
        </form>
    );
}

export default Login;