import React from 'react';
import ReactDOM from 'react-dom/client';
import TopicDetails from './components/TopicDetails';

const root = document.getElementById('root');

// Vérifier si l'utilisateur est connecté
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
  window.location.href = '/'; // ou '/index.html' selon ton routage
}

// Récupérer le slug de l'URL
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

// Charger les sujets depuis localStorage
const topics = JSON.parse(localStorage.getItem('topics') || '[]');

// Trouver le sujet correspondant
const topic = topics.find(t => t.slug === slug);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TopicDetails topic={topic} user={user} />
  </React.StrictMode>
);
