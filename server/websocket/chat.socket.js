const chatController = require('../controllers/chat.controller');

function chatSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // 用户加入自己的房间，房间名使用 userId/User joins their own room; the room name is the userId
        socket.on('join', (userId) => {
            socket.join(userId.toString());
            socket.userId = userId; // 绑定到 socket 上，方便调试/断开时处理/Bind to the socket for easier debugging and disconnection handling
            console.log(`User ${userId} joined room ${userId}`);
        });

        // 监听发送消息/Listen for sending messages
        socket.on('send_message', async (data) => {
            const { senderId, receiverId, message } = data;

            // 存储消息到数据库/sage message to database
            const savedMessage = await chatController.saveMessage(senderId, receiverId, message);

            // 发送消息给接收方所在的房间/Send message to the room where the recipient is located
            io.to(receiverId.toString()).emit('receive_message', {
                senderId,
                message,
                timestamp: savedMessage.timestamp
            });
            // 推送通知给接收方/Push notification to the recipient
            const notify = await chatController.sendNotification(senderId, receiverId, message);
            io.to(receiverId.toString()).emit('receive_notification', notify);
        });

        // 客户端主动请求通知（比如未读消息提醒）/Client actively requests notifications (e.g., unread message reminders)
        socket.on('request_notifications', async (userId) => {
            const demoNotify = {
                senderId: 'system',
                receiverId: userId,
                message: 'new message received',
                timestamp: new Date().toISOString()
            };
            socket.emit('receive_notification', demoNotify);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = chatSocket;