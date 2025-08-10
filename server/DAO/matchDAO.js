const db = require('../models/db');

// 3.1 发起匹配请求（插入一条新的匹配记录）
exports.createMatch = async (ride_offer_id, ride_request_id) => {
    const result = await db.query(
        `INSERT INTO ride_match (ride_offer_id, ride_request_id,match_time, status)
         VALUES (?, ?, now(),'pending')`,
        [ride_offer_id, ride_request_id]
    );
    return result.insertId;
};

// 3.2 获取匹配信息（根据匹配 ID 获取一条匹配记录）
exports.getMatchById = async (id) => {
    const rows = await db.query(
        `SELECT rm.*, ro.user_id AS driver_id
         FROM ride_match rm
                  JOIN ride_info ro ON rm.ride_offer_id = ro.id
         WHERE rm.id = ?`,
        [id]
    );
    return rows[0];  // 如果没有结果，返回 undefined
};

// 3.3 更新匹配状态（例如接受、拒绝）
exports.updateMatchStatus = async (id, status) => {
    await db.query(`UPDATE ride_match SET status = ? WHERE id = ?`, [status, id]);
};
