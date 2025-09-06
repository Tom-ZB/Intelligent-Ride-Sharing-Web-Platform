import { Outlet, useNavigate } from "react-router-dom";
import "./home.scss";
import {removeToken} from "../utils";
import {useEffect, useState} from "react";
import {getSocket, initSocket} from "../utils/socket";
import user from "../store/modules/user";
import {getUnreadMessagesAPI} from "../apis/chat";
import {useSelector} from "react-redux";

export default function Home() {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0); // 存储未读消息数量
    const userId = useSelector(state => {

        return state.user.userInfo.id
    } );

    const handleNavClick = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const setup = async () => {
            // 1️ 初始化 socket
            initSocket(user.id);

            let socket;
            try {
                socket = getSocket(); // 获取全局初始化的 socket
            } catch (err) {
                console.warn("⚠️ Socket not ready yet:", err.message);
                return;
            }

            // 2️拉取未读消息数量
            try {
                const res = await getUnreadMessagesAPI();
                // 只统计别人发给你的未读消息
                const unreadMessages = res.filter(msg => msg.senderId !== userId);
                setUnreadCount(unreadMessages.length);
            } catch (err) {
                console.error("Failed to fetch unread messages:", err);
            }

            // 3️监听 WebSocket 新消息
            socket.on("receive_notification", () => {
                setUnreadCount(prev => prev + 1); // 收到新消息数量加1
            });
        };

        setup();

        return () => {
            const socket = getSocket();
            socket?.off("receive_notification");
        };
    }, []);
    const handleLogout = () => {
        removeToken(); // 删除 token
        navigate("/auth/login", { replace: true }); // 跳转到登录页
    };

    const handleUnreadClick = () => {
        // 点击未读消息，跳转到 ChatList 页面
        setUnreadCount(0); // ✅ 清空未读数量
        navigate("/chat");
    };

    return (
        <div className="home">
            {/* 顶部导航 */}
            <header className="home-header">
                <div className="logo">LOGO</div>
                <nav className="nav-buttons">
                    <button onClick={() => handleNavClick("/")}>Home</button>
                    <button onClick={() => handleNavClick("/rides/create")}>Post a Ride</button>
                    <button onClick={() => handleNavClick("/rides")}>All Trips</button>
                    <button onClick={() => handleNavClick("/rides/myRideList")}>My Trip</button>
                    <button onClick={handleUnreadClick}>
                        Message Center {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                    <button onClick={() => handleNavClick("/user/profile")}>User Account</button>
                    <button onClick={handleLogout}>Logout</button> {/* 新增 Logout 按钮 */}
                </nav>
            </header>

            {/* 子页面渲染区域 */}
            <main className="home-content">
                <Outlet />
            </main>
        </div>
    );
}
