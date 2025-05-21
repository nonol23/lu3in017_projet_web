const User = require('../models/User');
const Message = require('../models/Message');
const Topic = require('../models/Topic');

exports.createMessage = async (req, res) => {
    try {
        const { content, topicId, authorId } = req.body; // Recevez authorId depuis le front

        if (!content || !topicId) {
            return res.status(400).json({ message: "Contenu et ID du topic requis" });
        }

        const newMessage = new Message({
        content,
        author: authorId, // Utilisez l'ID envoyé par le front
        topic: topicId
        });

        const savedMessage = await newMessage.save();

        // Mettre à jour le User
        await User.findByIdAndUpdate(authorId, {
        $push: { messages: savedMessage._id }
        });

        // Mettre à jour le Topic
        await Topic.findByIdAndUpdate(topicId, {
        $push: { messages: savedMessage._id }
        });

        // envoyer le message peuplé
        const populatedMessage = await Message.findById(savedMessage._id)
        .populate('author', 'prenom');

        res.status(201).json(populatedMessage);
  
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

  exports.getMessagesByTopic = async (req, res) => {
    try {
      const messages = await Message.find({ topic: req.params.topicId })
        .populate('author', 'prenom') // Récupère uniquement le prénom
        .sort({ createdAt: -1 });
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };