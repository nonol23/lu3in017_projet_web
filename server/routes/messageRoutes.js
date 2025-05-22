const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Route POST sans authMiddleware
router.post('/', messageController.createMessage); 



router.get('/topic/:topicId', messageController.getMessagesByTopic); // Spécifique d'abord
router.get('/message/:id', messageController.getMessageById);
// GET messages par user
router.get('/user/:userId', messageController.getMessagesByUser);



router.delete('/user/:id', messageController.deleteMessage);

router.put('/:id', messageController.updateMessage);

module.exports = router;