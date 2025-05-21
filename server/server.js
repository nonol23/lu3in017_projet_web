const express = require('express');
const cors = require('cors'); // pour autoriser les requêtes du frontend
const app = express();

// Middleware
app.use(cors()); // autoriser les requêtes depuis React
app.use(express.json()); // pour lire le JSON dans req.body

const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/forum-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🟢 Connecté à MongoDB"))
.catch((err) => console.error("🔴 Erreur MongoDB :", err));

mongoose.connection.once('open', async () => {
  console.log('Vérification admin par défaut...');
  
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const admin = new User({
      prenom: 'Admin',
      nom: 'Admin',
      email: 'Admin@example.com',
      identifiant: 'Admin',
      mdp: 'Admin',  
      role: 'admin',
      isValidated: true
    });
    await admin.save();
    console.log('Admin par défaut créé : admin/admin');
  }
});

// Route test
app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "UserTwo", "userThree"] });
});



const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const topicRoutes = require('./routes/topicRoutes');
app.use('/api', topicRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);


// Lancer le serveur
app.listen(5000, () => {
    console.log("Serveur lancé sur http://localhost:5000");
});