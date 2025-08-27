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
        `SELECT rm.*, ri.user_id AS driver_id
         FROM ride_match rm
                  JOIN ride_info ri ON rm.ride_offer_id = ri.id
         WHERE rm.id = ?`,
        [id]
    );
    return rows[0];  // 如果没有结果，返回 undefined
};

// 3.3 更新匹配状态（例如接受、拒绝）
exports.updateMatchStatus = async (id, status) => {
    await db.query(`UPDATE ride_match SET status = ? WHERE id = ?`, [status, id]);
};

// 获取某个用户的所有匹配
exports.findMatchesByUser = async (userId) => {
    const sql = `
        SELECT m.*,
               ro.id AS offer_id,
               ro.user_id AS offer_user_id,
               ro.from_location AS offer_from,
               ro.to_location AS offer_to,
               rr.id AS request_id,
               rr.user_id AS request_user_id,
               rr.from_location AS request_from,
               rr.to_location AS request_to
        FROM ride_match m
                 LEFT JOIN ride_info ro ON m.ride_offer_id = ro.id AND ro.user_id = ?
                 LEFT JOIN ride_info rr ON m.ride_request_id = rr.id AND rr.user_id = ?
        WHERE ro.id IS NOT NULL OR rr.id IS NOT NULL
        ORDER BY m.match_time DESC
    `;
    const [rows] = await db.query(sql, [userId, userId]);
    console.log("matches rows222:", rows); // 确认这里有两条
    return rows;
};


// 获取单个匹配详情
exports.findMatchById = async (id) => {
    const sql = `
    SELECT m.*, 
           ro.from_location AS offer_from,
           ro.to_location AS offer_to,
           rr.from_location AS request_from,
           rr.to_location AS request_to
    FROM ride_match m
    LEFT JOIN ride_info ro ON m.ride_offer_id = ro.id
    LEFT JOIN ride_info rr ON m.ride_request_id = rr.id
    WHERE m.id = ?
  `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};
