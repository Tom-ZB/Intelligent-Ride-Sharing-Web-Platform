const db = require('../models/db');

// 3.1 发起匹配请求/request a match
exports.createMatch = async (ride_offer_id, ride_request_id, initiator_user_id) => {
    const result = await db.query(
        `INSERT INTO ride_match
             (ride_offer_id, ride_request_id, match_time, status, initiator_user_id)
         VALUES (?, ?, NOW(), 'pending', ?)`,
        [ride_offer_id, ride_request_id, initiator_user_id]
    );
    return result.insertId;
};


// 3.2 获取匹配信息/get match info
exports.getMatchById = async (matchId) => {
    const sql = `
        SELECT m.*,
               ro.id AS offer_id,
               ro.user_id AS offer_user_id,
               ro.from_location AS offer_from,
               ro.to_location AS offer_to,
               ro.seats_available AS offer_seats_available,
               rr.id AS request_id,
               rr.user_id AS request_user_id,
               rr.from_location AS request_from,
               rr.to_location AS request_to,
               rr.seats_available AS request_seats_available
        FROM ride_match m
        LEFT JOIN ride_info ro ON m.ride_offer_id = ro.id
        LEFT JOIN ride_info rr ON m.ride_request_id = rr.id
        WHERE m.id = ?
    `;
    const rows = await db.query(sql, [matchId]);
    return rows[0];
};

// 更新匹配状态/update status of match
exports.updateMatchStatus = async (matchId, status) => {
    const sql = `UPDATE ride_match SET status = ? WHERE id = ?`;
    await db.query(sql, [status, matchId]);
};

// 更新行程座位数量/update the number of seats
exports.updateSeatsAvailable = async (rideId, seatsLeft) => {
    const sql = `UPDATE ride_info SET seats_available = ? WHERE id = ?`;
    await db.query(sql, [seatsLeft, rideId]);
};

// 获取某个用户的所有匹配/get all match by user
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
    const rows = await db.query(sql, [userId, userId]);
    return rows;
};


// 获取单个匹配详情/get one match by id
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

//获取全部匹配/get all match
exports.findAllMatches = async () => {
    const sql = `
    SELECT m.*, 
           ro.from_location AS offer_from,
           ro.to_location AS offer_to,
           rr.from_location AS request_from,
           rr.to_location AS request_to
    FROM ride_match m
    LEFT JOIN ride_info ro ON m.ride_offer_id = ro.id
    LEFT JOIN ride_info rr ON m.ride_request_id = rr.id
  `;
    const [rows] = await db.query(sql);
    return rows;
};
