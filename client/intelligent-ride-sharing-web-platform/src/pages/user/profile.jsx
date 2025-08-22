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
    }, [dispatch]);


    // 如果还没有获取到用户信息，显示加载中
    if (!userInfo || Object.keys(userInfo).length === 0) {
        return <div className="profile-container">loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Info</h2>
            <div className="profile-card">
                <img
                    src={userInfo.avatar ? `/image/${userInfo.avatar}` : "/default-avatar.png"}
                    alt="avatar"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <p><strong>username：</strong> {userInfo.username}</p>
                    <p><strong>email：</strong> {userInfo.email}</p>
                    <p><strong>registration time：</strong> {userInfo.created_time}</p>
                    <p><strong>status：</strong> {userInfo.status}</p>
                    <p><strong>role：</strong> {userInfo.role}</p>
                </div>
            </div>
            <button className="edit-btn" onClick={() => navigate("/setting")}>
                edit account info
            </button>
        </div>
    );
};



export default Profile