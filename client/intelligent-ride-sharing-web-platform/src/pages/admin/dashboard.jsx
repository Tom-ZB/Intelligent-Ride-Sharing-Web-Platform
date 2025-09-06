import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserList } from "../../store/modules/userList";
import { fetchRides } from "../../store/modules/rideInfo";
import { fetchAllMatches } from "../../store/modules/matches";
import "./dashboard.scss"
import {removeToken} from "../../utils";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 获取全局数据
    const users = useSelector((state) => state.userList.users);
    const rides = useSelector((state) => state.rideInfo.rides); // 假设 rideInfo 已有全局状态
    const matches = useSelector((state) => state.matches.matches);   // 假设 matches 已有全局状态

    useEffect(() => {
        dispatch(fetchUserList()); // 加载用户列表
        dispatch(fetchRides());     // 加载行程信息
        dispatch(fetchAllMatches());      // 加载匹配信息
    }, [dispatch]);

    // 用户数量统计
    const totalUsers = users.length;
    const bannedUsers = users.filter((u) => u.status === "inactive").length;

    // 行程统计
    const totalRides = rides.length;
    const activeRides = rides.filter((r) => r.status === "active").length;
    const completedRides = rides.filter((r) => r.status === "completed").length;
    const cancelledRides = rides.filter((r) => r.status === "cancelled").length;

    // 匹配统计
    const totalMatches = matches.length;
    const confirmedMatches = matches.filter((m) => m.status === "confirmed").length;
    const pendingMatches = matches.filter((m) => m.status === "pending").length;
    const successRate = totalMatches ? ((confirmedMatches / totalMatches) * 100).toFixed(2) : 0;

    const handleLogout = () => {
        removeToken(); // 删除 token
        navigate("/auth/login", { replace: true }); // 跳转到登录页
    };

    return (
        <div className="admin-dashboard" style={{ padding: "20px" }}>
            <h1>Administrator Dashboard</h1>

            <button className="logout-button" onClick={handleLogout}>Logout</button>

            {/* 用户统计模块 */}
            <section style={{ marginBottom: "20px" }}>
                <h2>User</h2>
                <p>total user count: {totalUsers}</p>
                <p>banned user count: {bannedUsers}</p>
                <button onClick={() => navigate("/admin/users")}>check user list</button>
            </section>

            {/* 行程统计模块 */}
            <section style={{ marginBottom: "20px" }}>
                <h2>ride count</h2>
                <p>total ride count: {totalRides}</p>
                <p>active count: {activeRides}</p>
                <p>completed count: {completedRides}</p>
                <p>cancelled count: {cancelledRides}</p>
            </section>

            {/* 匹配统计模块 */}
            <section>
                <h2>match count</h2>
                <p>total matched count: {totalMatches}</p>
                <p>success rate: {successRate}%</p>
                <p>pending count: {pendingMatches}</p>
            </section>
        </div>
    );
};


export default AdminDashboard;