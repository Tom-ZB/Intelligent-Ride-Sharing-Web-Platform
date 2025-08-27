import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateRideAPI, getRideByIdAPI } from "../../apis/rideInfo";
import { message, Form, Input, Select, Button, DatePicker, InputNumber, Spin } from "antd";
import moment from "moment";
import "./editRideInfo.scss";

const { Option } = Select;

const RideEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true); // 页面加载时的loading

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const res = await getRideByIdAPI(id);
                const ride = res.data;
                form.setFieldsValue({
                    type: ride.type,
                    fromLocation: ride.fromLocation,
                    toLocation: ride.toLocation,
                    departureTime: moment(ride.departureTime),
                    seatsAvailable: ride.seatsAvailable,
                    status: ride.status,
                });
            } catch (err) {
                message.error("Failed to fetch ride info");
            } finally {
                setFetching(false);
            }
        };
        fetchRide();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = {
                ...values,
                departureTime: values.departureTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            };
            await updateRideAPI(id, formData);
            message.success("Ride updated successfully");
            navigate("/rides");
        } catch (err) {
            message.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="ride-edit-loading"><Spin size="large" /></div>;

    return (
        <div className="ride-edit-container">
            <h2>Edit Ride</h2>
            <Form
                form={form}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="type"
                    label="Ride Type"
                    rules={[{ required: true, message: "Please enter ride type" }]}
                >
                    <Input placeholder="e.g., offer or request" />
                </Form.Item>

                <Form.Item
                    name="fromLocation"
                    label="From"
                    rules={[{ required: true, message: "Please enter departure location" }]}
                >
                    <Input placeholder="Departure location" />
                </Form.Item>

                <Form.Item
                    name="toLocation"
                    label="To"
                    rules={[{ required: true, message: "Please enter destination" }]}
                >
                    <Input placeholder="Destination" />
                </Form.Item>

                <Form.Item
                    name="departureTime"
                    label="Departure Time"
                    rules={[{ required: true, message: "Please select departure time" }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="seatsAvailable"
                    label="Seats Available"
                    rules={[{ required: true, message: "Please enter number of seats" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true }]}
                >
                    <Select placeholder="Select status">
                        <Option value="active">Active</Option>
                        <Option value="full">Full</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Save
                    </Button>
                    <Button style={{ marginLeft: 16 }} onClick={() => navigate("/rides")}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RideEdit;
