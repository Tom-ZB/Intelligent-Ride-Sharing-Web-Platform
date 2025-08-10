const adminDAO = require('../DAO/adminDAO');

// 6.1 获取所有用户
exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminDAO.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// 6.2 封禁用户（将 status 改为 inactive）
exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 检查是否存在用户
        const user = await adminDAO.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 如果用户已经是 inactive
        if (user.status === 'inactive') {
            return res.status(400).json({ error: "User is already banned" });
        }

        await adminDAO.banUser(id);
        res.json({ message: `User ID ${id} has been banned (status set to inactive)` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to ban user" });
    }
};

// 6.3 解封用户（将 status 改为 active）
exports.unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 检查用户是否存在
        const user = await adminDAO.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 如果用户已经是 active
        if (user.status === 'active') {
            return res.status(400).json({ error: "User is already active" });
        }

        // 更新用户状态为 active
        await adminDAO.unbanUser(id);
        res.json({ message: `User ID ${id} has been unbanned (status set to active)` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unban user" });
    }
};

