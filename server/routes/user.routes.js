const express = require('express');
const upload = require("../middleware/upload");
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证中间件

// 注册用户
//* 注册用户 用户需要头像  ok
router.post('/auth/register', upload.single("avatar"), userController.register);

// 登录用户 ok
router.post('/auth/login', userController.login);

// 修改用户信息（需要登录） ok
router.put('/users/:id',authenticateToken, userController.updateUser);

// 注销用户（状态改为 inactive，需要登录） ok
router.patch('/users/:id/deactivate', authenticateToken, userController.deactivateUser);

module.exports = router;