import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAPI } from "../../apis/user";
import "./register.scss";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        avatar: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            setFormData({ ...formData, avatar: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 构建 FormData
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("password", formData.password);
            if (formData.avatar) {
                formDataToSend.append("avatar", formData.avatar);
            }

            await registerAPI(formDataToSend);

            alert("registered successfully ！");
            navigate("/auth/login");
        } catch (err) {
            console.error("Register error:", err);
            setError("register failed，please check your input");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Registration</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="please input your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="please input your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="please input your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Avatar</label>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "registering..." : "register"}
                    </button>
                </form>

                <p className="login-link">
                    Have Account？ <Link to="/auth/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
