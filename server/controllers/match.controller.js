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
        const matchId = req.params.id;
        const { status } = req.body; // accepted / rejected
        const userId = req.user.id;

        const match = await matchDAO.getMatchById(matchId);
        // console.log("match:", match);
        // console.log("offerSeatsLeft:", match.offer_seats_available - match.request_seats_available);


        if (!match) return res.status(404).json({ message: "Match not found" });

        // 权限校验：只有车主或乘客才能操作
        if (![match.offer_user_id, match.request_user_id].includes(userId)) {
            return res.status(403).json({ message: "No permission" });
        }

        // 如果接受匹配，需要更新座位
        if (status === "accepted") {
            // 车主是 offer_user_id，乘客是 request_user_id
            const offerSeatsLeft = match.offer_seats_available - match.request_seats_available;
            if (offerSeatsLeft < 0) {
                return res.status(200).json({
                    success: false,
                    message: `Not enough seats. Offer has ${match.offer_seats_available}, but request asks for ${match.request_seats_available}.`
                });
            }
            await matchDAO.updateSeatsAvailable(match.offer_id, offerSeatsLeft);
        }

        console.log("matchId:", matchId);
        console.log("req.body:", req.body);
        console.log("match from DB:", match);


        // 更新匹配状态
        await matchDAO.updateMatchStatus(matchId, status);

        // 返回更新后的匹配信息
        const updatedMatch = await matchDAO.getMatchById(matchId);
        res.json(updatedMatch);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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
