const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证中间件


// 创建行程  ok
router.post('/rides', authenticateToken, rideController.createRide);

// 获取所有帖子（可带查询参数）
router.get('/rides', rideController.getAllRides);

// 编辑帖子  ok
router.put('/rides/:id', authenticateToken, rideController.updateRide);

// 删除帖子 ok
router.delete('/rides/:id', authenticateToken, rideController.deleteRide);

module.exports = router;