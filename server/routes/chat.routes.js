const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenticateToken = require('../middleware/auth');


router.get('/chats/:userId', authenticateToken, chatController.getAllChatHistory);

// 新增：获取当前用户的未读消息
router.get('/chats/unread', authenticateToken, chatController.getUnreadMessages);

// 新增：标记消息为已读
router.post('/chats/mark-read', authenticateToken, chatController.markMessageAsRead);

module.exports = router;