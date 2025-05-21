const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Route POST sans authMiddleware
router.post('/', messageController.createMessage); 
router.get('/:topicId', messageController.getMessagesByTopic);

module.exports = router;