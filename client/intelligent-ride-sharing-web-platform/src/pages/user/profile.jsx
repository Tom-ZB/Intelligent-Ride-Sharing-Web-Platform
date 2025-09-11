// src/pages/user/Profile.jsx
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
import {fetchUserInfo} from "../../store/modules/user";

const Profile = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate();

    // 组件挂载时执行一次，拉取用户信息
    useEffect(() => {
        console.log("Profile mounted, dispatching fetchUserInfo");
        dispatch(fetchUserInfo());
        console.log(userInfo)
    }, [dispatch]);


    // 如果还没有获取到用户信息，显示加载中
    if (!userInfo || Object.keys(userInfo).length === 0) {
        return <div className="profile-container">loading...</div>;
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
        const year = String(date.getFullYear()).slice(-2); // 取年份后两位
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };


    return (
        <div className="profile-container">
            <h2>Info</h2>
            <div className="profile-card">
                <img
                    src={`http://localhost:3000${userInfo.avatar}`}
                    alt="avatar"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <p><strong>username：</strong> {userInfo.username}</p>
                    <p><strong>email：</strong> {userInfo.email}</p>
                    <p><strong>registration time：</strong> {formatDate(userInfo.created_time)}</p>
                    <p><strong>status：</strong> {userInfo.status}</p>
                    <p><strong>role：</strong> {userInfo.role}</p>
                </div>
            </div>
            <button className="edit-btn" onClick={() => navigate("/user/setting")}>
                edit account info
            </button>
        </div>
    );
};



export default Profile