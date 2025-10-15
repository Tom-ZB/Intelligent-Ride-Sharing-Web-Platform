const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenticateToken = require('../middleware/auth');


router.get('/chats/:userId', authenticateToken, chatController.getAllChatHistory);

router.get('/chats/unread', authenticateToken, chatController.getUnreadMessages);

router.post('/chats/mark-read', authenticateToken, chatController.markMessageAsRead);

module.exports = router;