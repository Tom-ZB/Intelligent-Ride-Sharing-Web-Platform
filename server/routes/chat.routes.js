const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenticateToken = require('../middleware/auth');

router.get('/chats/:userId', authenticateToken, chatController.getChatHistory);

module.exports = router;