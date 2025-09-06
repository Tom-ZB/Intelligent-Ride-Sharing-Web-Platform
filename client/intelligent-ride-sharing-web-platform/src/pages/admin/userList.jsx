import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserList, deactivateUser, activateUser } from "../../store/modules/userList";
import { useNavigate } from "react-router-dom";
import "./userList.scss"; // 使用全局样式

const AdminUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector((state) => state.userList.users);

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    const handleBanToggle = (user) => {
        if (user.status === "active") {
            dispatch(deactivateUser(user.id));
        } else {
            dispatch(activateUser(user.id));
        }
    };

    return (
        <div className="user-list-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            <h1>Registered Users</h1>
            <table className="user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id} className={user.status === "inactive" ? "banned-row" : ""}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <button
                                    className={user.status === "active" ? "ban-btn" : "unban-btn"}
                                    onClick={() => handleBanToggle(user)}
                                >
                                    {user.status === "active" ? "Ban" : "Unban"}
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No users found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};



export default AdminUsers;