const db = require('../models/db');

// 创建行程
exports.createRide = async (userId, type, fromLocation, toLocation, departureTime, seatsAvailable, status = 'active') => {
    const sql = `
        INSERT INTO ride_info (user_id, type, from_location, to_location, departure_time, seats_available, status, created_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const result = await db.query(sql, [
        userId, type, fromLocation, toLocation, departureTime, seatsAvailable, status
    ]);
    return result.insertId;
};

// 获取所有行程（可选查询）
exports.getAllRides = async (search, status) => {
    let sql = `
        SELECT r.id, r.type, r.from_location AS fromLocation, r.to_location AS toLocation,
               r.departure_time AS departureTime, r.seats_available AS seatsAvailable,
               r.status, u.id AS userId, u.username
        FROM ride_info r
        JOIN user u ON r.user_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (search) {
        sql += " AND (r.from_location LIKE ? OR r.to_location LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
        sql += " AND r.status = ?";
        params.push(status);
    }

    sql += " ORDER BY r.created_time DESC";

    const rows = await db.query(sql, params);
    return rows.map(row => ({
        id: row.id,
        type: row.type,
        fromLocation: row.fromLocation,
        toLocation: row.toLocation,
        departureTime: row.departureTime,
        seatsAvailable: row.seatsAvailable,
        status: row.status,
        user: { id: row.userId, username: row.username }
    }));
};

// 获取单个行程
exports.getRideById = async (id) => {
    const sql = `SELECT * FROM ride_info WHERE id = ?`;
    const rows = await db.query(sql, [id]);
    return rows[0];
};

// 更新行程
exports.updateRide = async (id, type, fromLocation, toLocation, departureTime, seatsAvailable, status) => {
    const sql = `
        UPDATE ride_info
        SET type=?, from_location=?, to_location=?, departure_time=?, seats_available=?, status=?
        WHERE id=?
    `;
    await db.query(sql, [
        type, fromLocation, toLocation, departureTime, seatsAvailable, status, id
    ]);
};

// 删除行程
exports.deleteRide = async (id) => {
    const sql = `DELETE FROM ride_info WHERE id=?`;
    await db.query(sql, [id]);
};
