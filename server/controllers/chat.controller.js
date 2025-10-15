const chatDAO = require('../DAO/chatDAO');

// 保存消息/save messages
exports.saveMessage = async (senderId, receiverId, message) => {
    console.log("Chat from frontend:", senderId, receiverId, message);
    const timestamp = await chatDAO.saveMessage(senderId, receiverId, message);
    return { senderId, receiverId, message, timestamp, isRead: false };
};

// 获取聊天历史/get chat history
exports.getAllChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const messages = await chatDAO.getAllChats(userId);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

// 获取用户未读消息/get unread messages
exports.getUnreadMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await chatDAO.getUnreadMessages(userId);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch unread messages" });
    }
};

// 标记消息为已读/mark as read
exports.markMessageAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.body;

        if (!otherUserId) {
            return res.status(400).json({ error: "otherUserId is required" });
        }

        await chatDAO.markMessageAsRead(userId, otherUserId);
        res.json({ success: true });
    } catch (err) {
        console.error("Error marking conversation as read:", err);
        res.status(500).json({ error: "Failed to mark conversation as read" });
    }
};

// 发送通知/send notification
exports.sendNotification = async (senderId, receiverId, message) => {
    // 这里不落库，只实时推送/Do not persist to database here, only push in real time
    const timestamp = new Date().toISOString();
    return { senderId, receiverId, message, timestamp, isRead: false };
};
