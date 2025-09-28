// src/utils/socket.js
import { io } from "socket.io-client";
import store from "../store";  // redux store
import { addMessage } from "../store/modules/chat"; // 聊天slice

let socket = null;

export const initSocket = (userId) => {
    if (!socket) {
        socket = io("ws://54.221.101.167", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket:", socket.id);
            if (userId) {
                socket.emit("join", userId); // 用户加入房间
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

