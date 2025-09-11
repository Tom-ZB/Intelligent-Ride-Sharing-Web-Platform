// src/pages/user/Setting.jsx
import React, {useEffect, useState} from "react";
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
        avatar: reduxUser.avatar || null,
    });

    useEffect(() =>console.log("reduxUser: ",reduxUser),[])

    const [avatarPreview, setAvatarPreview] = useState(null);
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
            setMessage("save successfully！");
        } catch (err) {
            setMessage("save failed：" + (err.message || ""));
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm("Are you sure to disable your account?")) return;

        setLoading(true);
        setMessage("");

        try {
            await deactivateUserAPI(reduxUser.id);
            dispatch(clearUserInfo());
            setMessage("Your account has been disabled，jump into login page...");
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);
        } catch (err) {
            setMessage("disable failed：" + (err.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setting-page">
            <h2>Account Setting</h2>

            <div className="form-group">
                <label>Username</label>
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
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="keep it if no input here"
                />
            </div>

            <div className="form-group">
                <label>Avatar</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                {avatarPreview || reduxUser.avatar ? (
                    <img
                        src={
                            avatarPreview
                                ? avatarPreview
                                : `http://localhost:3000${reduxUser.avatar}`
                        }
                        alt="avatar preview"
                        className="avatar-preview"
                    />
                ) : null}
            </div>


            <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "save"}
            </button>

            <button className="deactivate-btn" onClick={handleDeactivate} disabled={loading}>
                Disable Account
            </button>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Setting;