const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证
const isAdmin = require('../middleware/isAdmin'); // 检查是否为管理员


router.get('/admin/users', authenticateToken, isAdmin, adminController.getAllUsers);

router.patch('/admin/users/:id/ban', authenticateToken, isAdmin, adminController.banUser);

router.patch('/admin/users/:id/unban', authenticateToken, isAdmin, adminController.unbanUser);


module.exports = router;