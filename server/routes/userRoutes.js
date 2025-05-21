const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Récupérer tous les utilisateurs en attente de validation
router.get('/pending-users', async (req, res) => {
  try {
    const users = await User.find({ isValidated: false }).select('-mdp'); // sans mot de passe
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Valider un utilisateur
router.post('/validate-user/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isValidated: true });
    res.json({ message: "Utilisateur validé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Refuser un utilisateur (supprimer)
router.delete('/reject-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-mdp'); // on évite de renvoyer les mots de passe
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.patch('/:id/role', async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-mdp');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rôle" });
  }
});

module.exports = router;
