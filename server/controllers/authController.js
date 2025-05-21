const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { prenom, nom, email, identifiant, mdp, confirmMdp } = req.body;

    if (!prenom || !nom || !email || !identifiant || !mdp || !confirmMdp) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    if (mdp !== confirmMdp) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
    }

    const existing = await User.findOne({ $or: [{ email }, { identifiant }] });
    if (existing) {
      return res.status(400).json({ message: "Email ou identifiant déjà utilisé" });
    }

    const newUser = new User({ prenom, nom, email, identifiant, mdp, topics: [], messages: [], isValidated: false });
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
    console.error("Erreur signup:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifiant, mdp } = req.body;

    if (!identifiant || !mdp) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const user = await User.findOne({ identifiant, mdp });
    if (!user) {
      return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    if (!user.isValidated) {
      return res.status(403).json({ message: "Votre compte n'a pas encore été validé." });
    }

    const { mdp: _, ...userSansMdp } = user.toObject();

    res.status(200).json({
      message: "Connexion réussie",
      user: userSansMdp
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
