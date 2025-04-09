import { useState } from 'react'
import './App.css'

import Login from "./components/Login"
import SignIn from "./components/SignIn"
import Home from "./components/Home";

const App = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
  
    // Fonction pour gérer la connexion réussie
    const handleLoginSuccess = (user) => {
      setCurrentUser(user);
    };
  
    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
      setCurrentUser(null);
    };
  
    return (
      <div className="app-container">
        {currentUser ? (
          <Home user={currentUser} onLogout={handleLogout} />
        ) : showSignIn ? (
          <SignIn 
            onCancelClick={() => setShowSignIn(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              setShowSignIn(false);
            }}
          />
        ) : (
          <Login 
            onSignInClick={() => setShowSignIn(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    );
}

export default App
