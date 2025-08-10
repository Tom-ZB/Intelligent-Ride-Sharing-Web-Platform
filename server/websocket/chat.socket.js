const chatController = require('../controllers/chat.controller');

function chatSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // 监听发送消息
        socket.on('send_message', async (data) => {
            const { senderId, receiverId, message } = data;

            // 存储消息到数据库
            const savedMessage = await chatController.saveMessage(senderId, receiverId, message);

            // 将消息发给接收方
            io.to(receiverId.toString()).emit('receive_message', {
                senderId,
                message,
                timestamp: savedMessage.timestamp
            });
        });

        // 用户加入房间（基于 userId）
        socket.on('join', (userId) => {
            socket.join(userId.toString());
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = chatSocket;