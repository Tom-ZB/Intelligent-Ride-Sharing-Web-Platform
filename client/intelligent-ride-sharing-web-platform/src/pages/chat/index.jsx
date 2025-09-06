import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatHistoryAPI, markMessageAsReadAPI } from "../../apis/chat";
import { setMessages} from "../../store/modules/chat";
import {useNavigate} from "react-router-dom"; // 假设存了当前登录用户信息
import "./index.scss";

const ChatList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const messages = useSelector(state => state.chat.messages);
    const userId = useSelector(state => {

        return state.user.userInfo.id
    } );

    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {

        const fetchChatHistory = async () => {
            try {
                const res = await getChatHistoryAPI(userId);
                const history = res.sort((a, b) => new Date(a.time_stamp) - new Date(b.time_stamp));
                dispatch(setMessages(history));
                const counts = {};
                history.forEach(msg => {
                    if (msg.senderId !== userId && !msg.isRead) {
                        counts[msg.senderId] = (counts[msg.senderId] || 0) + 1;
                    }
                });
                setUnreadCounts(counts);

            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            }
        };
        fetchChatHistory();
    }, [userId,dispatch]);

    // 只保留每个其他用户的最后一条消息
    const lastMessagesByUser = {};
    messages.forEach(msg => {
        const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        lastMessagesByUser[otherId] = msg;
    });

    const handleMarkAsReadAndNavigate = async (otherUserId) => {
        try {
            // 先标记已读
            await markMessageAsReadAPI(otherUserId);

            const updatedMessages = messages.map(msg =>
                msg.senderId === otherUserId ? { ...msg, isRead: true } : msg
            );
            dispatch(setMessages(updatedMessages));
            setUnreadCounts(prev => ({ ...prev, [otherUserId]: 0 }));

            // 跳转到聊天页面
            navigate(`/chat/${otherUserId}`);
        } catch (err) {
            console.error("Failed to mark messages as read:", err);
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
            {Object.entries(lastMessagesByUser).map(([otherUserId, msg]) => (
                <div key={otherUserId} className="chat-item">
                    <div className="chat-info" onClick={() => navigate(`/chat/${otherUserId}`)}>
                        <div>
                            <strong>Sender ID:</strong> {msg.senderId === userId ? "me" : msg.senderId}
                        </div>
                        <div>
                            <strong>Receiver ID:</strong> {msg.receiverId === userId ? "me" : msg.receiverId}
                        </div>
                        <div>
                            <strong>Last Message:</strong> {msg.message}
                        </div>
                        <div>
                            <strong>Time:</strong> {new Date(msg.time_stamp).toLocaleString()}
                        </div>
                    </div>
                    {unreadCounts[otherUserId] > 0 && (
                        <button
                            className="unread-btn"
                            onClick={() => handleMarkAsReadAndNavigate(otherUserId)}
                        >
                            unread {unreadCounts[otherUserId]}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatList;