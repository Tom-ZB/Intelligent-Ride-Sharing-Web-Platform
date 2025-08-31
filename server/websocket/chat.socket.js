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

            // 发送消息给接收方所在的房间
            io.to(receiverId.toString()).emit('receive_message', {
                senderId,
                message,
                timestamp: savedMessage.timestamp
            });
            // 3. 推送通知给接收方
            const notify = await chatController.sendNotification(senderId, receiverId, message);
            io.to(receiverId.toString()).emit('receive_notification', notify);
        });

        // 客户端主动请求通知（比如未读消息提醒）
        socket.on('request_notifications', async (userId) => {
            // 这里简单返回一个 demo
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