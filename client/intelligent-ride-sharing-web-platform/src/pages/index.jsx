import { Outlet, useNavigate } from "react-router-dom";
import "./home.scss";
import {removeToken} from "../utils";

export default function Home() {
    const navigate = useNavigate();

    const handleNavClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        removeToken(); // 删除 token
        navigate("/auth/login", { replace: true }); // 跳转到登录页
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
                    <button onClick={() => handleNavClick("/chat")}>Message Center</button>
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
