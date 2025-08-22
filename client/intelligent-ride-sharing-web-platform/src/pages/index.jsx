import { Outlet, useNavigate } from "react-router-dom";
import "./home.scss";

export default function Home() {
    const navigate = useNavigate();

    const handleNavClick = (path) => {
        navigate(path);
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
                    <button onClick={() => handleNavClick("/rides/1")}>My Trip</button>
                    <button onClick={() => handleNavClick("/chat")}>Message Center</button>
                    <button onClick={() => handleNavClick("/user/profile")}>User Account</button>
                </nav>
            </header>

            {/* 子页面渲染区域 */}
            <main className="home-content">
                <Outlet />
            </main>
        </div>
    );
}
