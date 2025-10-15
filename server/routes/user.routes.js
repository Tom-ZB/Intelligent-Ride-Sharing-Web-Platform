const express = require('express');
const upload = require("../middleware/upload");
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证中间件


router.post('/auth/register', upload.single("avatar"), userController.register);

router.post('/auth/login', userController.login);

router.get('/users/me', authenticateToken, userController.getUserInfo);

router.put('/users/:id',authenticateToken, upload.single("avatar"),userController.updateUser);

router.patch('/users/:id/deactivate', authenticateToken, userController.deactivateUser);

module.exports = router;