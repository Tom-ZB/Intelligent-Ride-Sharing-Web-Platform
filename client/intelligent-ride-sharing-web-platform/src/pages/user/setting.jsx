// src/pages/user/Setting.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getToken, removeToken } from "../../utils";
import { setUserInfo, clearUserInfo } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";
import "./setting .scss";
import {deactivateUserAPI, updateUserAPI} from "../../apis/user";

const Setting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = getToken();
    const reduxUser = useSelector((state) => state.user.userInfo);

    const [user, setUser] = useState({
        username: reduxUser?.username || "",
        email: reduxUser?.email || "",
        password: "",
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(reduxUser?.avatar || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser((prev) => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("email", user.email);
        if (user.password) formData.append("password", user.password);
        if (user.avatar) formData.append("avatar", user.avatar);

        try {
            const updatedUser = await updateUserAPI(reduxUser.id, formData);
            dispatch(setUserInfo(updatedUser));
            setMessage("保存成功！");
        } catch (err) {
            setMessage("保存失败：" + (err.message || ""));
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm("确定要注销账户吗？此操作不可恢复！")) return;

        setLoading(true);
        setMessage("");

        try {
            await deactivateUserAPI(reduxUser.id);
            dispatch(clearUserInfo());
            setMessage("账户已注销，正在跳转登录页...");
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);
        } catch (err) {
            setMessage("注销失败：" + (err.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setting-page">
            <h2>账户设置</h2>

            <div className="form-group">
                <label>用户名</label>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>密码</label>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="留空则不修改"
                />
            </div>

            <div className="form-group">
                <label>头像</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                {avatarPreview && (
                    <img
                        src={avatarPreview}
                        alt="avatar preview"
                        className="avatar-preview"
                    />
                )}
            </div>

            <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "保存中..." : "保存"}
            </button>

            <button className="deactivate-btn" onClick={handleDeactivate} disabled={loading}>
                注销账户
            </button>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Setting;