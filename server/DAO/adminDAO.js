const db = require('../models/db');

// 获取所有用户/get all users
exports.getAllUsers = async () => {
    const rows = await db.query(
        `SELECT id, username, email, role, status, created_time
         FROM user
         ORDER BY created_time DESC`
    );
    return rows;
};

// 获取单个用户/get user
exports.getUserById = async (id) => {
    const rows = await db.query(
        `SELECT id, username, email, role, status
         FROM user
         WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
};

// 封禁用户/ban user
exports.banUser = async (id) => {
    await db.query(
        `UPDATE user
         SET status = 'inactive'
         WHERE id = ?`,
        [id]
    );
};

// 解封用户/unban user
exports.unbanUser = async (id) => {
    await db.query(
        `UPDATE user 
     SET status = 'active' 
     WHERE id = ?`,
        [id]
    );
};
