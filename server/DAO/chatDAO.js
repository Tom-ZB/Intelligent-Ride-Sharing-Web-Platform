const db = require('../models/db');

// 保存消息
exports.saveMessage = async (senderId, receiverId, message) => {
    await db.query(
        `INSERT INTO chat_messages (sender_id, receiver_id, message, time_stamp, isRead)
         VALUES (?, ?, ?, NOW(), false)`,
        [senderId, receiverId, message]
    );
    return new Date(); // 返回当前时间戳
};

// 获取聊天历史记录（双方消息）
exports.getAllChats = async (userId) => {
    return await db.query(
        `SELECT
             sender_id AS senderId,
             receiver_id AS receiverId,
             message,
             time_stamp,
             isRead
         FROM chat_messages
         WHERE (sender_id = ? )
            OR ( receiver_id = ?)
         ORDER BY time_stamp `,
        [userId, userId]
    );
};

// 获取某用户的未读消息
exports.getUnreadMessages = async (userId) => {
    return await db.query(
        `SELECT
             id,
             sender_id AS senderId,
             message,
             time_stamp
         FROM chat_messages
         WHERE receiver_id = ? AND isRead = false
         ORDER BY time_stamp`,
        [userId]
    );
};

// 标记消息为已读
exports.markMessageAsRead = async (userId, otherUserId) => {
    return await db.query(
        `UPDATE chat_messages
         SET isRead = true
         WHERE sender_id = ? AND receiver_id = ? AND isRead = false`,
        [otherUserId, userId] // 对方发给我 的消息，设为已读
    );
};