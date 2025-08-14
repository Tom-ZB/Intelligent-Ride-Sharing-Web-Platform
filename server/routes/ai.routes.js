const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证


// 获取AI行程建议
router.post('/ai/suggestions', authenticateToken, aiController.getAISuggestions);

module.exports = router;