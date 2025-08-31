const chatDAO = require('../DAO/chatDAO');

// 保存消息（供 WebSocket 调用）
exports.saveMessage = async (senderId, receiverId, message) => {
    console.log("Chat from frontend:", senderId, receiverId, message);
    // DAO 层已默认 isRead = false
    const timestamp = await chatDAO.saveMessage(senderId, receiverId, message);
    return { senderId, receiverId, message, timestamp, isRead: false };
};

// 获取聊天历史（供 REST API 调用）
exports.getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;

        const messages = await chatDAO.getChatHistory(userId, otherUserId);
        res.json(messages); // messages 里已包含 isRead
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

// 获取用户未读消息（供前端上线拉取）
exports.getUnreadMessages = async (req, res) => {
    try {
        console.log("这里执行了")
        const userId = req.user.id;
        console.log("userId")
        const messages = await chatDAO.getUnreadMessages(userId);
        console.log("未读信息如下",messages)
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch unread messages" });
    }
};

// 标记消息为已读（前端点击查看消息时调用）
exports.markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.body;
        await chatDAO.markMessageAsRead(messageId);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to mark message as read" });
    }
};

// 发送通知（供 WebSocket 调用，实时推送）
exports.sendNotification = async (senderId, receiverId, message) => {
    // 这里不落库，只实时推送
    const timestamp = new Date().toISOString();
    return { senderId, receiverId, message, timestamp, isRead: false };
};
