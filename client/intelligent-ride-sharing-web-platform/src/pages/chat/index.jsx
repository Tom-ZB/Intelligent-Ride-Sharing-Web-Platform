import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChatHistoryAPI, markMessageAsReadAPI } from "../../apis/chat";
import { setMessages, addMessage  } from "../../store/modules/chat";
import user from "../../store/modules/user"; // 假设存了当前登录用户信息

const ChatList = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.chat.messages);
    const userId = useSelector(state => {

        return state.user.userInfo.id
    } );
    useEffect(() => {

        const fetchChatHistory = async () => {
            try {
                const res = await getChatHistoryAPI(userId);
                const history = res.sort((a, b) => new Date(a.time_stamp) - new Date(b.time_stamp));
                dispatch(setMessages(history));
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            }
        };
        fetchChatHistory();
    }, [userId,dispatch]);

    const handleMarkAsRead = async (message) => {
        if (!message.isRead) {
            try {
                await markMessageAsReadAPI(message.id);
                const updatedMessages = messages.map(m =>
                    m.id === message.id ? { ...m, isRead: true } : m
                );
                dispatch(setMessages(updatedMessages));
            } catch (err) {
                console.error("Failed to mark message as read:", err);
            }
        }
    };

    const groupedMessages = [];
    messages.forEach(msg => {
        const lastGroup = groupedMessages[groupedMessages.length - 1];
        if (lastGroup && lastGroup.senderId === msg.senderId) {
            lastGroup.items.push(msg);
        } else {
            groupedMessages.push({ senderId: msg.senderId, items: [msg] });
        }
    });

    return (
        <div className="chat-list">
            {groupedMessages.map((group, idx) => (
                <div key={idx} className={`message-group ${group.senderId === userId ? 'other' : 'self'}`}>
                    {/* 显示发送者ID：自己显示 "me"，对方显示 ID */}
                    <div className="sender-id">
                        {group.senderId === user.id ? "me" : group.senderId}
                    </div>
                    {group.items.map(msg => (
                        <div
                            key={msg.id}
                            className={`message-bubble ${msg.isRead ? 'read' : 'unread'}`}
                            onClick={() => handleMarkAsRead(msg)}
                        >
                            <div className="message-content">{msg.message}</div>
                            <div className="message-time">{new Date(msg.time_stamp).toLocaleString()}</div>
                            {!msg.isRead && <span className="unread-indicator">未读</span>}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChatList;