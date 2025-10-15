// src/utils/socket.js
import { io } from "socket.io-client";


let socket = null;

export const initSocket = (userId) => {
    if (!socket) {
        socket = io("http://localhost:3000", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket:", socket.id);
            if (userId) {
                socket.emit("join", userId); // 用户加入房间/User joins the room
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
        });
    }
    return socket;
};

export const sendMessage = (senderId, receiverId, message) => {
    if (socket) {
        socket.emit("send_message", { senderId, receiverId, message });
    }
};
export const getSocket = () => {
    if (!socket) {
        throw new Error("Socket not initialized. Call initSocket(userId) first.");
    }
    return socket;
};

