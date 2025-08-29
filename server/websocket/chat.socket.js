const chatController = require('../controllers/chat.controller');

function chatSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // 用户加入自己的房间，房间名使用 userId
        socket.on('join', (userId) => {
            socket.join(userId.toString());
            socket.userId = userId; // 绑定到 socket 上，方便调试/断开时处理
            console.log(`User ${userId} joined room ${userId}`);
        });

        // 监听发送消息
        socket.on('send_message', async (data) => {
            //console.log(data)
            const { senderId, receiverId, message } = data;

            // 存储消息到数据库
            const savedMessage = await chatController.saveMessage(senderId, receiverId, message);

            // 发送消息给接收方所在的房间，而不是直接用 receiverId 当 socketId
            io.to(receiverId.toString()).emit('receive_message', {
                senderId,
                message,
                timestamp: savedMessage.timestamp
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = chatSocket;