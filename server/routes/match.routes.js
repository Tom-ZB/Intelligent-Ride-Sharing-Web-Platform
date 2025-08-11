const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const authenticateToken = require('../middleware/auth'); // JWT 认证

// 发起匹配请求 ok
router.post('/matches', authenticateToken, matchController.createMatch);

// 更新匹配状态  ok
router.patch('/matches/:id/status',  authenticateToken, matchController.updateMatchStatus);

module.exports = router;