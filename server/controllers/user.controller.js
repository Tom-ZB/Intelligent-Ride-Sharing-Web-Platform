const userDAO = require('../DAO/userDAO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 注册用户/register user
exports.register = async (req, res) => {
    try {
        const { username, email, password, status } = req.body;
        const avatar = req.file ? `/image/${req.file.filename}` : null;

        // 1. 检查邮箱是否已经存在/check if the email is existing?
        const existingUser = await userDAO.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // 2. 加密密码/encrypt pw
        const hashedPassword = await bcrypt.hash(password, 10);

        const role = 'user';
        const userId = await userDAO.createUser(
            username,
            email,
            hashedPassword,
            status || 'active',
            avatar,
            role
        );

        res.json({ message: "User registered successfully", userId, avatar });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};



// 登录用户/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDAO.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid email or password" });

        const token = jwt.sign({ id: user.id, email: user.email ,role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                status: user.status
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

// 获取用户信息/get user info
exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userDAO.getUserById(userId);
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "user not existing" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "failed to get user info" });
    }
};

// 修改用户信息/edit user info
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, status } = req.body;
        const avatar = req.file ? `/image/${req.file.filename}` : null;


        // 权限检查：只能本人或管理员修改/permission check
        if (req.user.id !== parseInt(id)) {
            return res.status(403).json({ error: "Unauthorized to update this user" });
        }

        let hashedPassword = null;
        if (password) hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await userDAO.updateUser(id, username, email, hashedPassword, status,avatar);
        res.json({ message: "User information updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
};


// 注销用户/disable account
exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)

        // 权限检查：只能本人或管理员注销/permission check
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