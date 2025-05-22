import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

function SearchBar({ currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    topics: [],
    users: [],
    showResults: false,
    loading: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        performSearch();
      } else {
        setSearchResults(prev => ({ ...prev, showResults: false }));
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const performSearch = async () => {
    try {
      setSearchResults(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur de recherche');
      
      const { topics, users } = await response.json();
      
      setSearchResults({
        topics,
        users: users.filter(user => user._id !== currentUser._id), // Exclure l'utilisateur actuel
        showResults: true,
        loading: false
      });
    } catch (error) {
      setSearchResults(prev => ({ ...prev, loading: false }));
      console.error('Search error:', error);
    }
  };

  const handleTopicClick = (topicId) => {
    setSearchTerm('');
    setSearchResults(prev => ({ ...prev, showResults: false }));
    navigate(`/topic/${topicId}`);
  };

  const handleUserClick = (userId) => {
    setSearchTerm('');
    setSearchResults(prev => ({ ...prev, showResults: false }));
    navigate(`/public-profil/${userId}`);
  };

  return (
    <div className="search-container">
      <div className="search-form">
        <input
          type="text"
          placeholder="Rechercher des topics ou utilisateurs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchResults.loading && (
          <div className="search-loading">⌛</div>
        )}
      </div>

      {searchResults.showResults && (
        <div className="search-results">
          {searchResults.topics.length > 0 && (
            <div className="results-section">
              <h3>Topics</h3>
              <ul>
                {searchResults.topics.map(topic => (
                  <li 
                    key={topic._id} 
                    className="result-item"
                    onClick={() => handleTopicClick(topic._id)}
                  >
                    <span className="result-title">{topic.subject}</span>
                    <span className="result-meta">
                      par {topic.author?.prenom}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchResults.users.length > 0 && (
            <div className="results-section">
              <h3>Utilisateurs</h3>
              <ul>
              {searchResults.users.map(user => (
                <li 
                  key={user._id} 
                  className="result-item user-result"
                  onClick={() => handleUserClick(user._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="result-title">
                    {user.prenom} {user.nom}
                  </span>
                </li>
              ))}
              </ul>
            </div>
          )}

          {searchResults.topics.length === 0 && 
           searchResults.users.length === 0 && (
            <p className="no-results">Aucun résultat trouvé</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;