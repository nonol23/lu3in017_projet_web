import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

import Login from "./components/Login";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import CreateTopic from "./components/CreateTopic";
import TopicDetail from './components/TopicDetails';
import Profil from "./components/Profil";
import Validation from "./components/Validation"
import AdminHome from "./components/AdminHome"

const App = () => {
  const { user, setUser } = useAuth();  // user du contexte
  const [topics, setTopics] = useState([]);

  /*      Pour les Topics           */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/topics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajoutez l'authentification si nécessaire
          }
        });
        
        if (!res.ok) throw new Error('Erreur réseau');
        
        const data = await res.json();
        setTopics(data.topics || []); // Sécurité si data.topics est undefined
      } catch (err) {
        console.error('Erreur récupération topics:', err);
        setTopics([]); // Met un tableau vide en cas d'erreur
      }
    };
  
    if (user) fetchTopics();
  }, [user]);

  /*      Pour le Login       */
  const handleLoginSuccess = (user) => {
    setUser(user);  // met à jour dans le contexte
  };


  /*      Pour le Logout          */
  const handleLogout = () => {
    setUser(null);
    setTopics([]);
  };

  /*      Pour le Profil           */
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  /*      Pour les changements de mot de passe           */
  const handlePasswordChange = (passwordData) => {
    if (!user) {
      alert("Veuillez vous connecter");
      return false;
    }
  
    try {
      const errors = [];
  
      if (user.identifiant !== passwordData.identifiant) {
        errors.push("Identifiant incorrect");
      }
      if (user.mdp !== passwordData.oldPassword) {
        errors.push("Ancien mot de passe incorrect");
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        errors.push("Les mots de passe ne correspondent pas");
      }
      if (passwordData.newPassword.length < 6) {
        errors.push("Le mot de passe doit faire au moins 6 caractères");
      }
  
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return false;
      }
  
      setUser({
        ...user,
        mdp: passwordData.newPassword,
      });
  
      alert("Mot de passe modifié avec succès");
      return true;
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du changement de mot de passe");
      return false;
    }
  };
  

  /*      Pour les ajouts de sujets           */
  const handleAddTopic = (newTopic) => {
    setTopics((prev) => [...prev, newTopic]);
  };

  return (
      <div className="app-container">


        <Routes>

          <Route
            path="/"
            element={
              user ? (
                <Home user={user} onLogout={handleLogout} topics={topics} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Route pour le profil */}
          <Route
            path="/profil"
            element={
              user ? (
                <Profil
                  user={user}
                  onUpdate={handleUpdateProfile}
                  onPasswordChange={handlePasswordChange}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />


          {/*      Pour les ajouts de sujets           */}
          <Route 
            path="/create-topic" element={
              user ? (
                <CreateTopic onSubmit={handleAddTopic}  />
              ) : (
                <Navigate to="/login"/>
              )
          } />

          {/*      Pour le login           */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/*      Pour les SignIn        */}
          <Route
            path="/signin"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <SignIn onSuccess={handleLoginSuccess} />
              )
            }
          />
          {/*      Pour la page des sujets         */}
          <Route path="/topic/:id" element={<TopicDetail topics={topics} />} />

          {/* Route pour adminhome*/}
          <Route 
            path="/admin"
            element={
              user?.role === 'admin' ? 
                <AdminHome 
                  user={user}
                  onLogout={handleLogout}
                  topics={topics}
                  setTopics={setTopics}
                /> : 
                <Navigate to="/" />
            }
          />
        </Routes>
      </div>
  );
};



export default App;
