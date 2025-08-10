const db = require('../models/db');

// 保存消息
exports.saveMessage = async (senderId, receiverId, message) => {
    await db.query(
        `INSERT INTO chat_messages (sender_id, receiver_id, message, time_stamp)
         VALUES (?, ?, ?, NOW())`,
        [senderId, receiverId, message]
    );
    return new Date(); // 返回当前时间戳
};

// 获取聊天历史记录（双方消息）
exports.getChatHistory = async (userId, otherUserId) => {
    const [rows] = await db.query(
        `SELECT
             sender_id AS senderId,
             receiver_id AS receiverId,
             message,
             time_stamp
         FROM chat_messages
         WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY time_stamp `,
        [userId, otherUserId, otherUserId, userId]
    );
    return rows;
};