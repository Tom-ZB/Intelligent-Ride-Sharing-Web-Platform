const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const authenticateToken = require('../middleware/auth'); // JWT 认证

// 发起匹配请求 ok
router.post('/matches', authenticateToken, matchController.createMatch);

// 更新匹配状态  ok
router.patch('/matches/:id/status',  authenticateToken, matchController.updateMatchStatus);

// 获取某个用户的所有匹配
router.get('/matches', authenticateToken, matchController.getMatchesByUser);

// 获取单个匹配详情
router.get('/matches/:id', authenticateToken, matchController.getMatchById);

module.exports = router;