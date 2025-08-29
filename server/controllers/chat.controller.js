const chatDAO = require('../DAO/chatDAO');

// 保存消息（供 WebSocket 调用）
exports.saveMessage = async (senderId, receiverId, message) => {
    console.log("前端传入的数据是",senderId, receiverId, message)
    const timestamp = await chatDAO.saveMessage(senderId, receiverId, message);
    return { senderId, receiverId, message, timestamp };
};

// 获取聊天历史（供 REST API 调用）
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await chatDAO.getChatHistory(userId, otherUserId);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};