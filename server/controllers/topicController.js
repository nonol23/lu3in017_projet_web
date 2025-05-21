const Topic = require('../models/Topic');
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
      .select('subject content slug createdAt author') // Explicitement sélectionner les champs
      .exec();

    res.json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des sujets' });
  }
};

