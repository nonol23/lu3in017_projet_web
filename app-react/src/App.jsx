import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Profil from "./components/Profil";
import CreateTopic from "./components/CreateTopic";
import Validation from "./components/Validation"
import AdminHome from "./components/AdminHome"

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const savedTopics = localStorage.getItem(`topics_${currentUser.username}`);
      setTopics(savedTopics ? JSON.parse(savedTopics) : []);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`topics_${currentUser.username}`, JSON.stringify(topics));
    }
  }, [topics, currentUser]);

  const handleLoginSuccess = (user) => {
    // Récupérer l'utilisateur depuis le localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    // Vérifier si l'utilisateur existe et que les identifiants correspondent
    if (savedUser && savedUser.identifiant === user.identifiant && savedUser.mdp === user.mdp) {
        setCurrentUser({
        ...savedUser,
        username: savedUser.identifiant,
        role: savedUser.role || 'user' // Garde le rôle existant ou 'user' par défaut
      });
    } else {
        alert("Identifiants incorrects");
    }
  };

  const handleSignInSuccess = (user) => {
    // Ajoute le champ username pour la cohérence
    const userWithUsername = {
      ...user,
      username: user.identifiant
    };
    
    // Sauvegarde dans localStorage
    localStorage.setItem('user', JSON.stringify(userWithUsername));
    
    // Connecte l'utilisateur
    setCurrentUser(userWithUsername);
    
    // Redirige vers la page d'accueil
    navigate('/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTopics([]);
    navigate('/login');
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handlePasswordChange = (passwordData) => {
    try {
      if (!currentUser) {
        alert("Veuillez vous connecter");
        return false;
      }

      const errors = [];
      if (currentUser.identifiant !== passwordData.identifiant) errors.push("Identifiant incorrect");
      if (currentUser.mdp !== passwordData.oldPassword) errors.push("Ancien mot de passe incorrect");
      if (passwordData.newPassword !== passwordData.confirmPassword) errors.push("Les mots de passe ne correspondent pas");
      if (passwordData.newPassword.length < 6) errors.push("Le mot de passe doit faire au moins 6 caractères");

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
      }

      setCurrentUser({
        ...currentUser,
        mdp: passwordData.newPassword
      });

      alert("Mot de passe modifié avec succès");
      return true;
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du changement de mot de passe");
      return false;
    }
  };

  const addTopic = (newTopic) => {
    setTopics((prev) => [...prev, newTopic]);
  };


  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route
            path="/"
            element={
              currentUser ? (
                <Home 
                  user={currentUser} 
                  onLogout={handleLogout}
                  topics={topics}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route pour le profil */}
          <Route
            path="/profil"
            element={
              currentUser ? (
                <Profil
                  user={currentUser}
                  onUpdate={handleUpdateProfile}
                  onPasswordChange={handlePasswordChange}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route pour créer un topic */}
          <Route
            path="/create-topic"
            element={
              currentUser ? (
                <CreateTopic
                  onSubmit={(topicName) => {
                    const slug = topicName.trim().toLowerCase().replace(/\s+/g, '-');
                    const newTopic = {
                      id: Date.now(),
                      name: topicName,
                      slug,
                      createdBy: currentUser.prenom,
                      dateCreated: new Date().toLocaleString(),
                    };
                    addTopic(newTopic);
                  }}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route pour le login */}
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/" />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Route pour l'inscription */}
          <Route
            path="/signin"
            element={
              currentUser ? 
                <Navigate to="/" replace /> : 
                <SignIn onSuccess={handleSignInSuccess} /> 
            }
          />

          {/* Route pour adminhome*/}
          <Route 
            path="/admin"
            element={
              currentUser?.role === 'admin' ? 
                <AdminHome 
                  user={currentUser}
                  onLogout={handleLogout}
                  topics={topics}
                  setTopics={setTopics}
                /> : 
                <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;