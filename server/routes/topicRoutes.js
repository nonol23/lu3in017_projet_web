const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Quand un POST est fait sur /api/topics/create, appelle topicController.createTopic
router.post('/topics', topicController.createTopic);

router.get('/topics', topicController.getAllTopics);

module.exports = router;
