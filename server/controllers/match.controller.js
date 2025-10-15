const matchDAO = require('../DAO/matchDAO');

// 3.1 发起匹配请求/request to match
exports.createMatch = async (req, res) => {
    try {
        const { ride_offer_id, ride_request_id } = req.body;
        const initiator_user_id = req.user.id;

        const matchId = await matchDAO.createMatch(
            ride_offer_id,
            ride_request_id,
            initiator_user_id
        );

        const newMatch = await matchDAO.getMatchById(matchId);
        res.json(newMatch);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 3.2 更新匹配状态 /update match status
exports.updateMatchStatus = async (req, res) => {
    try {

        const matchId = req.params.id;
        const { status } = req.body; // accepted / rejected
        const userId = req.user.id;
        console.log(status)

        const match = await matchDAO.getMatchById(matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });
        // 权限校验：只有车主或乘客才能操作/Permission check: only the driver or passenger can perform this action
        if (![match.offer_user_id, match.request_user_id].includes(userId)) {
            return res.status(403).json({ message: "No permission" });
        }

        // 如果接受匹配，需要更新座位/If the match is accepted, the seats need to be updated
        if (status === "confirmed") {
            const offerSeatsLeft = match.offer_seats_available - match.request_seats_available;
            if (offerSeatsLeft < 0) {
                return res.status(200).json({
                    success: false,
                    message: `Not enough seats. Offer has ${match.offer_seats_available}, but request asks for ${match.request_seats_available}.`
                });
            }
            await matchDAO.updateSeatsAvailable(match.offer_id, offerSeatsLeft);
        }

        // 更新匹配状态/update status
        await matchDAO.updateMatchStatus(matchId, status);
        const updatedMatch = await matchDAO.getMatchById(matchId);
        res.json(updatedMatch);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 获取某个用户的所有匹配/get match by user
exports.getMatchesByUser = async (req, res) => {
    try {
        const userId = req.query.userId;
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

// 获取单个匹配详情/get match by id
exports.getMatchById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id is:",id)
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

// 获取全部匹配数据/get all match
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await matchDAO.findAllMatches();
        res.json(matches);
    } catch (err) {
        console.error("Error getting all matches:", err);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};
