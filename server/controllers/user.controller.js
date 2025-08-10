const userDAO = require('../dao/userDAO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 注册用户
exports.register = async (req, res) => {
    try {
        const { username, email, password, status } = req.body;
        const avatar = req.file ? `/image/${req.file.filename}` : null;

        const hashedPassword = await bcrypt.hash(password, 10);  //生成不可逆的哈希

        const role = 'user'; // 强制设置为普通用户
        const userId = await userDAO.createUser(username, email, hashedPassword, status || 'active', avatar, role);

        res.json({ message: "User registered successfully", userId, avatar });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};


// 登录用户
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDAO.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);  //用来验证输入的密码和哈希是否匹配
        if (!match) return res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                status: user.status
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

// 修改用户信息
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, status } = req.body;

        // 权限检查：只能本人或管理员修改
        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: "Unauthorized to update this user" });
        }

        let hashedPassword = null;
        if (password) hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await userDAO.updateUser(id, username, email, hashedPassword, status);
        res.json({ message: "User information updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
};


// 注销用户（软删除：改状态为 inactive）
exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 权限检查：只能本人或管理员注销
        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: "Unauthorized to deactivate this user" });
        }

        await userDAO.deactivateUser(id);
        res.json({ message: "User account deactivated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Deactivation failed" });
    }
};