import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRideAPI } from "../../apis/rideInfo";
import { addRide } from "../../store/modules/rideInfo";
import "./create.scss";

const RideCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        type: "offer", // driver or passenger
        location: "",
        destination: "",
        departure_time: "",
        availableSeats: 1,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // 处理输入框
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await createRideAPI(form);
            console.log("到这了")
            dispatch(addRide(res)); // 更新 Redux
            setMessage("✅ Ride created successfully!");
            navigate("/rides"); // 跳转到行程列表
        } catch (err) {
            console.error("Create ride error:", err);
            setMessage("❌ Failed to create ride");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ride-create-container">
            <div className="ride-create-card">
                <h2>Create a Ride</h2>
                <form className="ride-create-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={form.type} onChange={handleChange}>
                            <option value="offer">offer</option>
                            <option value="request">request</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Enter start location"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Destination</label>
                        <input
                            type="text"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            placeholder="Enter destination"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Departure Time</label>
                        <input
                            type="datetime-local"
                            name="departure_time"
                            value={form.departure_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        {form.type === "offer" ? "Available Seats" : "Seats Needed"}
                        <input
                            type="number"
                            name="availableSeats"
                            min="1"
                            value={form.availableSeats}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {message && <p className="message">{message}</p>}

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Creating..." : "Create Ride"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RideCreate;
