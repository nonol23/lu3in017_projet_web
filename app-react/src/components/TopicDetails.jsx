const TopicDetails = ({ topic }) => {
    if (!topic) {
      return <h2>Sujet introuvable</h2>;
    }
  
    return (
      <div>
        <h1>{topic.name}</h1>
        <p>Créé par {topic.createdBy} le {topic.dateCreated}</p>
        <p>Ici, tu pourras afficher des messages ou commentaires plus tard.</p>
      </div>
    );
  };
  
  export default TopicDetails;