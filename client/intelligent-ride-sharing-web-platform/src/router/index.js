// 路由配置
import { createBrowserRouter } from "react-router-dom";
import { AuthRoute } from "../components/AuthRoute";

import Home from "../pages/index";

// Auth
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

// User
import Profile from "../pages/user/profile";
import Settings from "../pages/user/setting";

// Rides (原来的 posts)
import RideList from "../pages/rides/index";
import RideCreate from "../pages/rides/create";
import RideDetail from "../pages/rides/myRideList";

// Matches
import MatchList from "../pages/matches/index";
import MatchDetail from "../pages/matches/[id]";

// Chat
import ChatList from "../pages/chat/index";
import ChatChannel from "../pages/chat/chatChannel";

// AI
import AIAnswer from "../pages/ai/answer";

// Map
import MapPage from "../pages/map/index";

// Admin
import AdminDashboard from "../pages/admin/dashboard";
import AdminUsers from "../pages/admin/userList";

// Errors
import NotFound from "../pages/errors/404";
import Forbidden from "../pages/errors/403";

// 配置路由
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthRoute>
                <Home />
            </AuthRoute>
        ),
        children: [
            // 首页默认渲染 map + AI 页面
            {
                index: true,
                element: (
                    <>
                        <MapPage />
                        <AIAnswer />
                    </>
                ),
            },
            // 其它导航跳转页面作为 Home 的子路由
            {
                path: "rides",
                element: <RideList />,
            },
            {
                path: "rides/create",
                element: <RideCreate />,
            },
            {
                path: "rides/:id",
                element: <RideDetail />,
            },
            {
                path: "chat",
                element: <ChatList />,
            },
            {
                path: "chat/:chatId",
                element: <ChatChannel />,
            },
            {
                path: "map",
                element: <MapPage />,
            },
            {
                path: "ai",
                element: <AIAnswer />,
            },
        ],
    },
    {
        path: "/auth/login",
        element: <Login />,
    },
    {
        path: "/auth/register",
        element: <Register />,
    },
    {
        path: "/user/profile",
        element: (
            <AuthRoute>
                <Profile />
            </AuthRoute>
        ),
    },
    {
        path: "/user/setting",
        element: (
            <AuthRoute>
                <Settings />
            </AuthRoute>
        ),
    },
    {
        path: "/matches",
        element: (
            <AuthRoute>
                <MatchList />
            </AuthRoute>
        ),
    },
    {
        path: "/matches/:id",
        element: (
            <AuthRoute>
                <MatchDetail />
            </AuthRoute>
        ),
    },
    {
        path: "/admin/dashboard",
        element: (
            <AuthRoute>
                <AdminDashboard />
            </AuthRoute>
        ),
    },
    {
        path: "/admin/users",
        element: (
            <AuthRoute>
                <AdminUsers />
            </AuthRoute>
        ),
    },
    {
        path: "/403",
        element: <Forbidden />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
