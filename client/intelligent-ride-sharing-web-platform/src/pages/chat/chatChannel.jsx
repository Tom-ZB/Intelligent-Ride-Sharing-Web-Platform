import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSocket, initSocket, sendMessage} from "../../utils/socket";
import {addMessage} from "../../store/modules/chat";
import "./chatChannel.scss"

const ChatChannel = () => {
    const { chatId  } = useParams(); // 从路由获取行程列表用户id即消息接收方id
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const messages = useSelector((state) => state.chat.messages);

    const chatIdNum = Number(chatId);  //发送消息的人
    const userIdNum = Number(user.id);  //接收消息的人或者对方的 ID

    const chatEndRef = useRef(null);
    // 自动滚动到底部
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 监听接收到的消息
    useEffect(() => {
        if (!userIdNum) return; // 等待用户信息可用
        let socket;
        socket = getSocket(); // 获取全局初始化的 socket

        if (!userIdNum) return; // 等待 user.id 可用

        // 2 加入自己的房间
        socket.emit("join", userIdNum);
        console.log("Joined room:", userIdNum);

        // 监听消息
        const handleMessage = (data) => {
            const { senderId, receiverId, message,timestamp } = data;

            // 处理可能缺少receiverId的情况
            const actualReceiverId = receiverId ? Number(receiverId) : userIdNum;
            const senderIdNum = Number(senderId);

            // 更精确的条件：只处理对方发给我的消息
            if (senderIdNum === chatIdNum && actualReceiverId === userIdNum) {
                // 把传来的 timestamp 规范成数字（如果无法转换则用 Date.now()）
                let tsCandidate = null;
                if (timestamp !== undefined && timestamp !== null) {
                    tsCandidate = (typeof timestamp === "number") ? timestamp : Number(timestamp);
                }
                const ts = Number.isFinite(tsCandidate) ? tsCandidate : Date.now();

                dispatch(addMessage({
                    senderId: senderIdNum,
                    receiverId: actualReceiverId,
                    message: message,
                    timestamp: ts
                }));
            }
        };
        socket.on("receive_message", handleMessage);

        // 组件卸载时清理监听
        return () => {
            //4卸载时清理
            socket.off("receive_message", handleMessage);
        };
    }, [userIdNum,chatIdNum,dispatch]);

    const handleSend = () => {
        if (msg.trim()) {
            sendMessage(user.id, chatId , msg);

            // 本地也立即显示发送的消息
            dispatch(addMessage({ senderId: userIdNum, receiverId: chatIdNum, message: msg ,timestamp: Date.now()}));
            setMsg("");
        }
    };

    // 过滤出当前对话的消息
    const currentChatMessages = messages.filter(
        (m) =>
            (Number(m.senderId) === chatIdNum && Number(m.receiverId) === userIdNum) ||
            (Number(m.senderId) === userIdNum && Number(m.receiverId) === chatIdNum)
    );

    console.log("Current chat messages:", currentChatMessages);
    console.log("All messages in Redux:", messages);

    function formatDate(ts) {
        if (ts == null) return ""; // 没有时间时返回空字符串

        // 优先把 ts 转为数字（支持数字和数字字符串）
        let ms = Number(ts);
        if (!Number.isFinite(ms)) {
            // 如果不是纯数字，尝试 Date.parse（允许 ISO 字符串等）
            ms = Date.parse(ts);
        }
        if (!Number.isFinite(ms)) return ""; // 无法解析则返回空，避免 NaN/... 显示

        const d = new Date(ms);
        const year = d.getFullYear();
        const month = d.getMonth() + 1; // 不强制补 0，结果像 2025/9/9
        const day = d.getDate();
        const hour = d.getHours().toString().padStart(2, "0");
        const minute = d.getMinutes().toString().padStart(2, "0");
        const second = d.getSeconds().toString().padStart(2, "0");
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    }


    return (
        <div className="chat-channel">
            <h2>Chat with {chatId}</h2>

            <div className="messages-container">
                {currentChatMessages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start a conversation!</div>
                ) : (
                    currentChatMessages.map((m, idx) => {
                        const isMe = Number(m.senderId) === userIdNum;
                        return (
                            <div key={m.id || idx} className={`message ${isMe ? "me" : "other"}`}>
                                <div className="sender">{isMe ? "You" : `User ${m.senderId}`}</div>
                                <div className="text">{m.message}</div>
                                <div className="timestamp">{formatDate(m.timestamp)}</div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="input-container">
                <input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatChannel