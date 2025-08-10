const db = require('../models/db'); // MySQL 连接池

// 创建用户
exports.createUser = async (username, email, hashedPassword, status, avatar, role) => {
    const result = await db.query(
        `INSERT INTO users (username, email, password, status, avatar, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, status, avatar, role]
    );
    return result.insertId;
};


// 根据 email 查找用户
exports.getUserByEmail = async (email) => {
    const sql = `SELECT * FROM user WHERE email = ?`;

    // 使用通用 query 方法
    const rows = await db.query(sql, [email]);

    // 返回第一条匹配的用户记录
    return rows[0];
};

// 更新用户信息
exports.updateUser = async (id, username, email, password, status) => {
    const updates = [];
    const values = [];

    if (username) { updates.push("username = ?"); values.push(username); }
    if (email) { updates.push("email = ?"); values.push(email); }
    if (password) { updates.push("password = ?"); values.push(password); }
    if (status) { updates.push("status = ?"); values.push(status); }

    // 如果没有更新字段，直接返回当前用户信息
    if (updates.length === 0) {
        const rows = await db.query(
            `SELECT id, username, email, status, created_time FROM user WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    values.push(id);

    // 更新用户信息
    await db.query(`UPDATE user SET ${updates.join(", ")} WHERE id = ?`, values);

    // 查询并返回更新后的用户信息
    const rows = await db.query(
        `SELECT id, username, email, status, created_time FROM user WHERE id = ?`,
        [id]
    );
    return rows[0];
};


// 注销用户（软删除：改状态为 inactive）
exports.deactivateUser = async (id) => {
    const sql = `UPDATE user SET status = 'inactive' WHERE id = ?`;
    await db.query(sql, [id]);
};

