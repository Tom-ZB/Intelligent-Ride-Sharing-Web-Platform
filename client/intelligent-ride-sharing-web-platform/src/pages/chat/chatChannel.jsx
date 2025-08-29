import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSocket, initSocket, sendMessage} from "../../utils/socket";
import {addMessage} from "../../store/modules/chat";

const ChatChannel = () => {
    const { chatId  } = useParams(); // 从路由获取行程列表用户id即消息接收方id
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const messages = useSelector((state) => state.chat.messages);

    const chatIdNum = Number(chatId);  //发送消息的人
    const userIdNum = Number(user.id);  //接收消息的人或者对方的 ID

    // 监听接收到的消息
    useEffect(() => {
        if (!userIdNum) return; // 等待用户信息可用
        // 1️⃣ 初始化 socket
        initSocket(user.id);
        let socket;
        try {
            socket = getSocket(); // 获取全局初始化的 socket
        } catch (err) {
            console.warn("⚠️ Socket not ready yet:", err.message);
            return; // 防止未初始化就执行
        }

        if (!userIdNum) return; // 等待 user.id 可用

        // 2 加入自己的房间
        socket.emit("join", userIdNum);
        console.log("Joined room:", userIdNum);

        // 监听消息
        const handleMessage = (data) => {
            console.log("Received message via socket:", data);
            const { senderId, receiverId, message } = data;
            // 只显示与当前聊天对象相关的消息
            if ( (Number(senderId) === chatIdNum && Number(receiverId) === userIdNum) || // 对方发给自己
                (Number(senderId) === userIdNum && Number(receiverId) === chatIdNum))  {  //自己发给对方的
                dispatch(addMessage({
                    senderId: Number(senderId),
                    receiverId: Number(receiverId),
                    message: message
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
            dispatch(addMessage({ senderId: userIdNum, receiverId: chatIdNum, message: msg }));
            setMsg("");
        }
    };

    //console.log("Current messages in Redux:", messages);

    return (
        <div>
            <h2>Chat with {chatId }</h2>
            <div style={{ border: "1px solid #ccc", height: 200, overflowY: "auto" }}>
                {messages
                    .filter(
                        (m) =>
                            (Number(m.senderId) === chatIdNum && Number(m.receiverId) === userIdNum) ||
                            (Number(m.senderId) === userIdNum && Number(m.receiverId) === chatIdNum)
                    )
                    .map((m) => (
                        <p key={m.id || Math.random()}>
                            <b>{Number(m.senderId) === userIdNum ? "Me" : m.senderId}</b>: {m.message}
                        </p>
                    ))}
            </div>
            <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default ChatChannel