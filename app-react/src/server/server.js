const express = require('express');
const cors = require('cors'); // pour autoriser les requêtes du frontend
const app = express();

// Middleware
app.use(cors()); // autoriser les requêtes depuis React
app.use(express.json()); // pour lire le JSON dans req.body

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/forum-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🟢 Connecté à MongoDB"))
.catch((err) => console.error("🔴 Erreur MongoDB :", err));

const User = require('./models/User');


// Route test
app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "UserTwo", "userThree"] });
});

// Route d'inscription
app.post('/api/auth/signup', async (req, res) => {
    try {
      const { prenom, nom, email, identifiant, mdp, confirmMdp } = req.body;
  
      if (!prenom || !nom || !email || !identifiant || !mdp || !confirmMdp) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
      }
  
      if (mdp !== confirmMdp) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
      }
  
      // Vérifier si l'utilisateur existe déjà
      const existing = await User.findOne({ $or: [{ email }, { identifiant }] });
      if (existing) {
        return res.status(400).json({ message: "Email ou identifiant déjà utilisé" });
      }
  
      const newUser = new User({ prenom, nom, email, identifiant, mdp, topics:[], messages:[] });
      await newUser.save();
  
      res.status(201).json({
        message: "Inscription réussie",
        user: {
          id: newUser._id,
          prenom: newUser.prenom,
          nom: newUser.nom,
          email: newUser.email,
          identifiant: newUser.identifiant,
          createdAt: newUser.createdAt,
          topics: [],
          messages: []
        }
      });
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
});
  
// Route connexion
app.post('/login', async (req, res) => {
    try {
        const { identifiant, mdp } = req.body;

        if (!identifiant || !mdp) {
        return res.status(400).json({ message: "Champs manquants" });
        }

        const user = await User.findOne({ identifiant, mdp });

        if (!user) {
        return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
        }

        const { mdp: _, ...userSansMdp } = user.toObject();

        res.status(200).json({
        message: "Connexion réussie",
        user: userSansMdp
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
  

// Lancer le serveur
app.listen(5000, () => {
    console.log("Serveur lancé sur http://localhost:5000");
});