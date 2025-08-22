//server入口文件
// Setup Express
const express = require("express");
const cors    = require("cors");
const path = require('path');

const http = require('http');
const { Server } = require('socket.io');
const chatSocket = require('./server/websocket/chat.socket');

const app = express();
require('dotenv').config(); // 加载 .env 文件内容到 process.env


// To help with accessing this server from Postman

app.use(cors());

// To store the static resource eg:image...
app.use(express.static(path.join(__dirname, 'server', 'public')));

// To help with POST and PUT requests to the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ message: "Welcome to IRS platform" });
});
const userRoutes = require("./server/routes/user.routes");
const rideRoutes = require("./server/routes/ride.routes");
const adminRoutes = require("./server/routes/admin.routes");
const aiRoutes = require("./server/routes/ai.routes");
const chatRoutes = require("./server/routes/chat.routes");
const matchRoutes = require("./server/routes/match.routes");

app.use("/", userRoutes);
app.use("/", rideRoutes);
app.use("/", adminRoutes);
//app.use("/", aiRoutes);
app.use("/", chatRoutes);
app.use("/", matchRoutes);

// 创建 HTTP + WebSocket 服务
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 初始化聊天 Socket
chatSocket(io);


// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your Node.js code
// can be seen in the terminal window used to run the server.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`CORS enabled Express web server is running on port ${PORT}.`);
});