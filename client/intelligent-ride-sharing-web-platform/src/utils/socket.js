// src/utils/socket.js
import { io } from "socket.io-client";
import store from "../store";  // redux store
import { addMessage } from "../store/modules/chat"; // 聊天slice

export let socket;

export const initSocket = (userId) => {
    if (!socket) {
        socket = io("http://localhost:3000", {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket:", socket.id);
            socket.emit("join", userId); // 用户加入房间
        });

        // // 监听消息
        // socket.on("receive_message", (data) => {
        //     console.log("receive_message:", data);
        //     store.dispatch(addMessage(data)); // 保存到 redux
        // });

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
    if (!socket) throw new Error("Socket not initialized. Call initSocket(userId) first.");
    return socket;
};

