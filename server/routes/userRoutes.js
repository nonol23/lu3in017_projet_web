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

//Lister tous les utilisateurs
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-mdp'); // on évite de renvoyer les mots de passe
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//Modifier le rôle d'un utilisateur
router.patch('/:id/role', async (req, res) => {
  const { role, currentUserId } = req.body; // récupère role voulu + id de celui qui fait la requête
  const targetUserId = req.params.id;

  if (targetUserId === currentUserId) {
    return res.status(403).json({ message: "Vous ne pouvez pas modifier votre propre rôle." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      targetUserId,
      { role },
      { new: true }
    ).select('-mdp');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rôle" });
  }
});

router.get('/user-messages/:userId', async (req, res) => {
  try {
      const messages = await Message.find({ author: req.params.userId })
          .select('content createdAt topic')
          .populate('topic', 'subject')
          .sort({ createdAt: -1 })
          .lean();

      res.json(messages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

//obtenir information d'un autre utiisateur
router.get('/:userId/public', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-mdp');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put('/:id', async (req, res) => {
  const { identifiant, prenom, nom, email } = req.body;
  const userId = req.params.id;

  try {
    // Vérifier si un autre utilisateur possède déjà cet identifiant
    if (identifiant) {
      const existingIdentifiant = await User.findOne({ identifiant, _id: { $ne: userId } });
      if (existingIdentifiant) {
        return res.status(400).json({ message: "Cet identifiant est déjà utilisé." });
      }
    }

    // Vérifier si un autre utilisateur possède déjà cet email
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }
    }

    // Trouver et mettre à jour l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mise à jour des champs
    user.identifiant = identifiant ?? user.identifiant;
    user.prenom = prenom ?? user.prenom;
    user.nom = nom ?? user.nom;
    user.email = email ?? user.email;
    //if (mdp) user.mdp = mdp; // Attention à hasher le mdp dans ton modèle ou ici

    await user.save();

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
});

router.put('/:id/change-password', async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Comparaison simple en clair
    if (user.mdp !== oldPassword) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect." });
    }

    // Remplacement direct
    user.mdp = newPassword;
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors du changement de mot de passe." });
  }
});



module.exports = router;
