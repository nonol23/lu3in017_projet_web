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


exports.getMessagesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({ author: userId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('author', 'prenom') // Modifié 'user' en 'author'
      .populate('topic', 'subject');
      
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  const currentUser = req.body.user; // attendu : { _id, role }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "message non trouvé" });
    }

    // Vérifie si c’est le propriétaire ou un admin
    if (message.author.toString() !== currentUser._id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce message." });
    }

    // Supprimer la référence dans Topic.messages
    if (message.topic) {
      await Topic.findByIdAndUpdate(message.topic, {
        $pull: { messages: message._id }
      });
    }

    // Supprimer la référence dans User.messages
    if (message.author) {
      await User.findByIdAndUpdate(message.author, {
        $pull: { messages: message._id }
      });
    }

    // Supprimer le message lui-même
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression du message." });
  }
};

exports.updateMessage = async (req, res) => {
  const messageId = req.params.id;
  const { content, user } = req.body;

  try {
    const message = await Message.findById(messageId).populate('topic');
    if (!message) return res.status(404).json({ message: "Message non trouvé" });

    if (message.author.toString() !== user._id && user.role !== 'admin') {
      return res.status(403).json({ message: "Non autorisé à modifier ce message" });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ 
      msg: "Message modifié avec succès", 
      messageUpdated: message 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};