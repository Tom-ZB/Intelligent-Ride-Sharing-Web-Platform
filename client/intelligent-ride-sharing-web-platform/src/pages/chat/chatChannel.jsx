import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSocket, sendMessage} from "../../utils/socket";
import {addMessage} from "../../store/modules/chat";
import "./chatChannel.scss"

const ChatChannel = () => {
    const { chatId  } = useParams(); // 从路由获取行程列表用户id即消息接收方id/Get the trip list user ID from the route, which is also the message recipient ID
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    // 在获取 Redux messages 后，对历史消息做字段规范化/After fetching Redux messages, normalize the fields of historical messages
    const messages = useSelector((state) =>
        state.chat.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || (msg.time_stamp ? new Date(msg.time_stamp).getTime() : Date.now())
        }))
    );


    const chatIdNum = Number(chatId);  //发送消息的人/Message sender
    const userIdNum = Number(user.id);  //接收消息的人或者对方的 ID/Message recipient or the other party's ID

    const chatEndRef = useRef(null);
    // 自动滚动到底部/Auto scroll to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 监听接收到的消息/Listen for received messages
    useEffect(() => {
        if (!userIdNum) return; // 等待用户信息可用/Wait for user information to be available
        let socket;
        socket = getSocket(); // 获取全局初始化的 socket/Get the globally initialized socket

        if (!userIdNum) return; // 等待 user.id 可用/Wait for user.id to be available

        // 2 加入自己的房间/Join your own room
        socket.emit("join", userIdNum);
        console.log("Joined room:", userIdNum);

        // 监听消息/Listen for messages
        const handleMessage = (data) => {
            const { senderId, receiverId, message,timestamp } = data;

            // 处理可能缺少receiverId的情况/Handle cases where receiverId may be missing
            const actualReceiverId = receiverId ? Number(receiverId) : userIdNum;
            const senderIdNum = Number(senderId);

            // 更精确的条件：只处理对方发给我的消息/More precise condition: only handle messages sent to me by the other party
            if (senderIdNum === chatIdNum && actualReceiverId === userIdNum) {
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

        // 组件卸载时清理监听/Clean up listeners when the component unmounts
        return () => {
            //4卸载时清理/Clean up on unmount
            socket.off("receive_message", handleMessage);
        };
    }, [userIdNum,chatIdNum,dispatch]);

    const handleSend = () => {
        if (msg.trim()) {
            sendMessage(user.id, chatId , msg);

            // 本地也立即显示发送的消息/Immediately display the sent message locally as well
            dispatch(addMessage({ senderId: userIdNum, receiverId: chatIdNum, message: msg ,timestamp: Date.now()}));
            setMsg("");
        }
    };

    // 过滤出当前对话的消息/Filter out the messages of the current conversation
    const currentChatMessages = messages.filter(
        (m) =>
            (Number(m.senderId) === chatIdNum && Number(m.receiverId) === userIdNum) ||
            (Number(m.senderId) === userIdNum && Number(m.receiverId) === chatIdNum)
    );

    function formatDate(ts) {
        if (ts == null) return "";
        let ms = Number(ts);
        if (!Number.isFinite(ms)) {
            ms = Date.parse(ts);
        }
        if (!Number.isFinite(ms)) return "";

        const d = new Date(ms);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
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