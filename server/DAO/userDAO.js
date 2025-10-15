const db = require('../models/db'); // MySQL 连接池

// 创建用户/create user
exports.createUser = async (username, email, hashedPassword, status, avatar, role) => {
    const result = await db.query(
        `INSERT INTO user (username, email, password, status, avatar, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, status, avatar, role]
    );
    return result.insertId;
};


// 根据 email 查找用户/ find user by email
exports.getUserByEmail = async (email) => {
    const sql = `SELECT * FROM user WHERE email = ?`;

    const rows = await db.query(sql, [email]);

    return rows[0];
};

// 根据用户 ID 获取完整信息/get user info by id
exports.getUserById = async (id) => {
    const sql = `
        SELECT id,username,email,created_time,status,avatar,role
        FROM user
        WHERE id = ?
    `;

    const rows = await db.query(sql, [id]);

    return rows[0];
};


// 更新用户信息/update user info
exports.updateUser = async (id, username, email, password, status,avatar) => {
    const updates = [];
    const values = [];

    if (username) { updates.push("username = ?"); values.push(username); }
    if (email) { updates.push("email = ?"); values.push(email); }
    if (password) { updates.push("password = ?"); values.push(password); }
    if (status) { updates.push("status = ?"); values.push(status); }
    if (avatar) { updates.push("avatar = ?"); values.push(avatar); }

    if (updates.length === 0) {
        const rows = await db.query(
            `SELECT id, username, email, status, created_time FROM user WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    values.push(id);
    await db.query(`UPDATE user SET ${updates.join(", ")} WHERE id = ?`, values);
    const rows = await db.query(
        `SELECT id, username, email, status, created_time FROM user WHERE id = ?`,
        [id]
    );
    return rows[0];
};


// 注销用户/disable user account
exports.deactivateUser = async (id) => {
    const sql = `UPDATE user SET status = 'inactive' WHERE id = ?`;
    await db.query(sql, [id]);
};

