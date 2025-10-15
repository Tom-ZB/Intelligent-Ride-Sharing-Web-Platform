const db = require('../models/db');
exports.saveAIInteraction = (userId, query, res, callback) => {
    db.query(
        `INSERT INTO ai_interactions (user_id, query, response, timestamp)
     VALUES (?, ?, ?, NOW())`,
        [userId, query, res],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, new Date());
        }
    );
};

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