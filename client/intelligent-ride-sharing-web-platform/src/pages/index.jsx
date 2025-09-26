import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./home.scss";
import { removeToken } from "../utils";
import { useEffect, useState } from "react";
import { getSocket, initSocket } from "../utils/socket";
import { getUnreadMessagesAPI } from "../apis/chat";
import { useSelector } from "react-redux";
import logo from "../assets/LOGO.png";
import backgroundImage from "../assets/Background.jpg";
import MapPage from "../pages/map"; // ✅ 引入地图页面

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const userId = useSelector((state) => state.user.userInfo.id);

    const handleNavClick = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const setup = async () => {
            // 初始化 socket
            initSocket(userId);

            let socket;
            try {
                socket = getSocket();
            } catch (err) {
                console.warn("⚠️ Socket not ready yet:", err.message);
                return;
            }

            // 拉取未读消息数量
            try {
                const res = await getUnreadMessagesAPI();
                const unreadMessages = res.filter((msg) => msg.senderId !== userId);
                setUnreadCount(unreadMessages.length);
            } catch (err) {
                console.error("Failed to fetch unread messages:", err);
            }

            // 监听新消息
            socket.on("receive_notification", () => {
                setUnreadCount((prev) => prev + 1);
            });
        };

        setup();

        return () => {
            const socket = getSocket();
            socket?.off("receive_notification");
        };
    }, [userId]);

    const handleLogout = () => {
        removeToken();
        navigate("/auth/login", { replace: true });
    };

    const handleUnreadClick = () => {
        setUnreadCount(0);
        navigate("/chat");
    };

    // ✅ 判断是否是首页或地图页
    const isMapPage = location.pathname === "/" || location.pathname.startsWith("/map");

    return (
        <div
            className="home"
            style={{
                backgroundImage: isMapPage ? "none" : `url(${backgroundImage})`, // ✅ 地图页不显示背景
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
            }}
        >
            {/* 顶部导航 */}
            <header className="home-header">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <nav className="nav-buttons">
                    <button onClick={() => handleNavClick("/")}>Home</button>
                    <button onClick={() => handleNavClick("/rides/create")}>Post a Ride</button>
                    <button onClick={() => handleNavClick("/rides")}>All Trips</button>
                    <button onClick={() => handleNavClick("/rides/myRideList")}>My Trip</button>
                    <button onClick={handleUnreadClick}>
                        Message Center {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                    <button onClick={() => handleNavClick("/user/profile")}>User Account</button>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </header>

            {/* 子页面渲染区域 */}
            <main className="home-content">
                {isMapPage ? <MapPage /> : <Outlet />}
            </main>
        </div>
    );
}
