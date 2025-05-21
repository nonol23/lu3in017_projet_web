const Topic = require('../models/Topic');
const User = require('../models/User');

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ 
        message: "La requête doit contenir au moins 2 caractères" 
      });
    }

    const [topics, users] = await Promise.all([
      // Recherche de topics
      Topic.find({ 
        $or: [
          { subject: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } }
        ]
      })
      .populate('author', 'prenom nom')
      .limit(5),
      
      // Recherche d'utilisateurs (seulement les champs publics)
      User.find({
        $or: [
          { prenom: { $regex: query, $options: 'i' } },
          { nom: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ],
        isValidated: true
      })
      .select('prenom nom email') // Seulement ces champs
      .limit(5)
    ]);

    res.json({ topics, users });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche' });
  }
};