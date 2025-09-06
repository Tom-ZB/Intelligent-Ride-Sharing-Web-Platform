const db = require('../models/db');

// 获取所有用户
exports.getAllUsers = async () => {
    const rows = await db.query(
        `SELECT id, username, email, role, status, created_time
         FROM user
         ORDER BY created_time DESC`
    );
    return rows;
};

// 获取单个用户
exports.getUserById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, username, email, role, status
         FROM user
         WHERE id = ?`,
        [id]  // 使用参数化查询防止 SQL 注入
    );
    return rows[0] || null; // 明确返回 null 避免 undefined
};

// 封禁用户（更新状态为 inactive）
exports.banUser = async (id) => {
    await db.query(
        `UPDATE user
         SET status = 'inactive'
         WHERE id = ?`,
        [id]
    );
};

// 解封用户（更新状态为 active）
exports.unbanUser = async (id) => {
    await db.query(
        `UPDATE user 
     SET status = 'active' 
     WHERE id = ?`,
        [id]
    );
};
