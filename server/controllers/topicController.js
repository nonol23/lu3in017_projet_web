const Topic = require('../models/Topic');
const Message = require('../models/Message');
const User = require('../models/User');

exports.createTopic = async (req, res) => {
  try {
    const { topicName, content, userId } = req.body;

    if (!topicName || !content || !userId) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const newTopic = new Topic({
      subject: topicName,
      content,
      author: userId,
      messages: []
    });

    await newTopic.save();

    await User.findByIdAndUpdate(userId, { $push: { topics: newTopic._id } });
    const populatedTopic = await Topic.findById(newTopic._id).populate('author', 'prenom');

    res.status(201).json({
      message: "Topic créé",
      topic: populatedTopic
    });

  } catch (error) {
    console.error("Erreur création topic:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate('author', 'prenom')
      //.select('subject content slug createdAt author') // Explicitement sélectionner les champs
      .exec();

    res.json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des sujets' });
  }
};


exports.getTopicsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const topics = await Topic.find({ author: userId })
      .populate('messages') // pour récupérer les messages liés
      .exec();
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('author', 'prenom')
      .populate('messages')
      .exec();

    if (!topic) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    res.json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteTopic = async (req, res) => {
  const topicId = req.params.id;
  const currentUser = req.body.user; // attendu : { _id, role }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Sujet non trouvé" });
    }

    // Vérifie si c’est le propriétaire ou un admin
    if (topic.author.toString() !== currentUser._id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce sujet." });
    }

    // 1. Trouver les messages associés à ce topic
    const messages = await Message.find({ topic: topicId });
    const messageIds = messages.map((m) => m._id);

    // 2. Supprimer ces messages
    await Message.deleteMany({ topic: topicId });

    // 3. Supprimer le topic
    await Topic.findByIdAndDelete(topicId);

    // 4. Retirer ce topic des utilisateurs
    await User.updateMany(
      { topics: topicId },
      { $pull: { topics: topicId } }
    );

    // 5. Retirer les messages associés des utilisateurs
    if (messageIds.length > 0) {
      await User.updateMany(
        { messages: { $in: messageIds } },
        { $pull: { messages: { $in: messageIds } } }
      );
    }

    res.status(200).json({ message: "Sujet supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression du sujet." });
  }
};


exports.updateTopic = async (req, res) => {
  const topicId = req.params.id;
  const { subject, content, user } = req.body;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Sujet non trouvé" });

    // Seul l'auteur ou un admin peut modifier
    if (topic.author.toString() !== user._id && user.role !== 'admin') {
      return res.status(403).json({ message: "Non autorisé à modifier ce sujet" });
    }

    topic.subject = subject;
    topic.content = content;

    await topic.save();

    res.status(200).json({ message: "Sujet modifié avec succès", topic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
