import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Profil.css';

function Profil({ user, onUpdate, onPasswordChange }) {
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChangeInput = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mise à jour dans le localStorage
        const updatedUser = {
            ...user,
            ...formData
        };
        
        // 1. Mettre à jour le localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 2. Mettre à jour l'état parent
        onUpdate(updatedUser);
        
        setIsUpdating(false);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Les nouveaux mots de passe ne correspondent pas !");
            return;
        }
        
        // Mise à jour du mot de passe dans le localStorage
        const updatedUser = {
            ...user,
            mdp: passwordData.newPassword
        };
        
        // 1. Mettre à jour le localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 2. Mettre à jour l'état parent
        onPasswordChange({
            identifiant: user.identifiant,
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
        });
        
        setIsChangingPassword(false);
        setPasswordData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div className="profil-container">
            <h1>Profil de {user.identifiant}</h1>
            
            {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                    <div className="password-change-form">
                        <div className="block-cube-prof">
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            
                            <p>
                                <label>Ancien mot de passe:</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChangeInput}
                                    required
                                />
                            </p>
                            <p>
                                <label>Nouveau mot de passe:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChangeInput}
                                    required
                                />
                            </p>
                            <p>
                                <label>Confirmer le nouveau mot de passe:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChangeInput}
                                    required
                                />
                            </p>
                        </div>
                        <div className="action-buttons">
                            <button type="submit" className="block-cube-prof">
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Enregistrer</div>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsChangingPassword(false)} 
                                className="block-cube-prof"
                            >
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Annuler</div>
                            </button>
                        </div>
                    </div>
                </form>
            ) : isUpdating ? (
                <form onSubmit={handleSubmit}>
                    <div className="informations">
                        <div className="block-cube-prof">
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            <p>
                                <input 
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                            <p>
                                <input 
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                            <p>
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="text-prof"
                                />
                            </p>
                        </div>
                        <div className="action-buttons">
                            <button type="submit" className="block-cube-prof">
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Enregistrer</div>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsUpdating(false)} 
                                className="block-cube-prof"
                            >
                                <div className="bg-top-prof"></div>
                                <div className="bg-right-prof"></div>
                                <div className="bg-prof"></div>
                                <div className="text-prof">Annuler</div>
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="informations">
                    <div className="block-cube-prof">
                        <div className="bg-top-prof"></div>
                        <div className="bg-right-prof"></div>
                        <div className="bg-prof"></div>
                        <p>
                            <span className="info-label">Identifiant:</span>
                            <span className="info-value">{user.identifiant}</span>
                        </p>
                        <p>
                            <span className="info-label">Prénom:</span>
                            <span className="info-value">{user.prenom}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                        <p>
                            <span className="info-label">Nom:</span>
                            <span className="info-value">{user.nom}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                        <p>
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user.email}</span>
                            <button onClick={() => setIsUpdating(true)} className="text-prof">
                                Modifier
                            </button>
                        </p>
                    </div>
                    <div className="action-buttons">
                        <button 
                            onClick={() => setIsChangingPassword(true)}
                            className="password-change-btn block-cube-prof"
                        >
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            <div className="text-prof">Modifier le mot de passe</div>
                        </button>
                        <button 
                            onClick={handleReturnHome} 
                            className="block-cube-prof"
                        >
                            <div className="bg-top-prof"></div>
                            <div className="bg-right-prof"></div>
                            <div className="bg-prof"></div>
                            <div className="text-prof">Retour à l'accueil</div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profil;