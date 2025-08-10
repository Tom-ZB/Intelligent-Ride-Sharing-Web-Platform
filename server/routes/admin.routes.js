const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证
const isAdmin = require('../middleware/isAdmin'); // 检查是否为管理员

//  获取所有用户（仅管理员可访问）
router.get('/admin/users', authenticateToken, isAdmin, adminController.getAllUsers);

// 封禁用户（仅管理员可操作）
router.patch('/admin/users/:id/ban', authenticateToken, isAdmin, adminController.banUser);

// 解封用户（仅管理员可操作）
router.patch('/admin/users/:id/unban', authenticateToken, isAdmin, adminController.unbanUser);


module.exports = router;