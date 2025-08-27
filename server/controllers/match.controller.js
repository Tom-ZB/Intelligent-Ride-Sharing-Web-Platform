const matchDAO = require('../DAO/matchDAO');

// 3.1 发起匹配请求
exports.createMatch = async (req, res) => {
    try {
        const { ride_offer_id, ride_request_id } = req.body;

        // 检查字段
        if (!ride_offer_id || !ride_request_id) {
            return res.status(400).json({ error: "Missing ride_offer_id or ride_request_id" });
        }

        // 创建匹配
        const matchId = await matchDAO.createMatch(ride_offer_id, ride_request_id);
        res.json({ message: "Match request created", matchId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create match" });
    }
};

// 3.2 更新匹配状态 (司机确认/拒绝)
exports.updateMatchStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 检查状态合法性
        const validStatuses = ['pending', 'accepted', 'declined'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // 检查匹配是否存在
        const match = await matchDAO.getMatchById(id);
        console.log(match);  // 查看是否包含 driver_id
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        // 仅司机可更改状态（假设司机是 ride_offer 的创建者）
        if (req.user.id !== match.driver_id) {
            return res.status(403).json({ error: "Only the driver can update match status" });
        }

        await matchDAO.updateMatchStatus(id, status);
        res.json({ message: "Match status updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update match status" });
    }
};

// 获取某个用户的所有匹配
exports.getMatchesByUser = async (req, res) => {
    try {
        const userId = req.query.userId; // 前端传 ?userId=xxx
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const matches = await matchDAO.findMatchesByUser(userId) || [];
        res.json(matches);
    } catch (err) {
        console.error("Error getting matches by user:", err);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};

// 获取单个匹配详情
exports.getMatchById = async (req, res) => {
    try {
        const id = req.params.id;
        const match = await matchDAO.findMatchById(id);
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        res.json(match);
    } catch (err) {
        console.error("Error getting match by id:", err);
        res.status(500).json({ error: "Failed to fetch match" });
    }
};
