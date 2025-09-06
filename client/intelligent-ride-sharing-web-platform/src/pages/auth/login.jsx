import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../../store/modules/user";
import "./login.scss";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo  = useSelector((state) => state.user.userInfo);

    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // dispatch(fetchLogin) 会把 token 和 userInfo 存到 redux
            await dispatch(fetchLogin(loginForm));

            // 从 redux 里拿 role
            const role = userInfo.role
            console.log(role)

            if (role === "admin") {
                navigate("/admin/dashboard"); // 管理员跳后台
            } else {
                navigate("/"); // 普通用户跳首页
            }

        } catch (err) {
            console.error("Login error:", err);
            setError("login failed，please check your account or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>user account</label>
                        <input
                            type="text"
                            name="email"
                            value={loginForm.email}
                            onChange={handleChange}
                            placeholder="please input your account"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>password</label>
                        <input
                            type="password"
                            name="password"
                            value={loginForm.password}
                            onChange={handleChange}
                            placeholder="please input your password"
                            required
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "logging..." : "login"}
                    </button>
                </form>

                <p className="register-link">
                    No Account？ <Link to="/auth/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
