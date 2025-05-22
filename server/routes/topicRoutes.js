const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Quand un POST est fait sur /api/topics/create, appelle topicController.createTopic
router.post('/topics', topicController.createTopic);

router.get('/topics', topicController.getAllTopics);

// Récupérer les topics d'un utilisateur donné
router.get('/topics/user/:userId', topicController.getTopicsByUser);

router.get('/topics/:id', topicController.getTopicById);


router.delete('/topics/:id', topicController.deleteTopic);

router.put('/topics/:id', topicController.updateTopic);


module.exports = router;
