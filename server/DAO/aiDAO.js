const db = require('../models/db');

// 保存 AI 交互记录
// 保存 AI 交互记录
exports.saveAIInteraction = (userId, query, res, callback) => {
    db.query(
        `INSERT INTO ai_interactions (user_id, query, response, timestamp)
     VALUES (?, ?, ?, NOW())`,
        [userId, query, res],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, new Date()); // 返回当前时间戳
        }
    );
};

// 查询用户的 AI 交互历史
exports.getAIHistoryByUser = (userId, callback) => {
    db.query(
        `SELECT query, response, timestamp
     FROM ai_interactions
     WHERE user_id = ?
     ORDER BY timestamp DESC`,
        [userId],
        (err, rows) => {
            if (err) return callback(err, null);
            callback(null, rows);
        }
    );
};