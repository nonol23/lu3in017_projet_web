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



// Route test
app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "UserTwo", "userThree"] });
});



const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

  

const topicRoutes = require('./routes/topicRoutes');
app.use('/api/topic', topicRoutes);



// Lancer le serveur
app.listen(5000, () => {
    console.log("Serveur lancé sur http://localhost:5000");
});