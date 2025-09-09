import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Select, message, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchRides } from "../../store/modules/rideInfo";
import { request } from "../../utils";
import {createMatch} from "../../store/modules/matches";
import {useNavigate} from "react-router-dom";



const { Option } = Select;
const { Search } = Input;

const RideList = () => {
    const dispatch = useDispatch();
    const rideInfo = useSelector((state) => state.rideInfo?.rides || []);
    const currentUser = useSelector((state) => state.user.userInfo);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMyRideId, setSelectedMyRideId] = useState(null); //选中的行程id
    const [targetRide, setTargetRide] = useState(null);  //弹窗中选中的行程id
    const [loading, setLoading] = useState(false);

    // 页面初始化加载所有行程
    useEffect(() => {
        dispatch(fetchRides());
    }, [dispatch]);


    // 搜索（向后端请求 /rides?search=xxx）
    const handleSearch = async (value) => {
        try {
            setLoading(true);
            const res = await request({
                url: `/rides?search=${encodeURIComponent(value)}`,
                method: "GET",
            });
            // ✅ 直接替换 redux 里的数据
            dispatch({ type: "rideInfo/setRides", payload: res });
        } catch (err) {
            console.error(err);
            message.error("Search failed");
        } finally {
            setLoading(false);
        }
    };

    // ✅ 状态过滤（向后端请求 /rides?status=xxx）
    const handleStatusFilter = async (status) => {
        try {
            setLoading(true);
            const res = await request({
                url: `/rides?status=${status}`,
                method: "GET",
            });
            dispatch({ type: "rideInfo/setRides", payload: res });
        } catch (err) {
            console.error(err);
            message.error("Filter failed");
        } finally {
            setLoading(false);
        }
    };

    // 打开匹配弹窗
    const openMatchModal = (ride) => {
        setTargetRide(ride);
        setIsModalOpen(true);
    };

    // 确认匹配
    const confirmMatch = () => {
        if (!selectedMyRideId) {
            message.warning("Select your ride");
            return;
        }

        const payload = {
            ride_offer_id:
                targetRide.type === "offer" ? targetRide.id : selectedMyRideId,
            ride_request_id:
                targetRide.type === "request" ? targetRide.id : selectedMyRideId,
        };

        createMatch(payload)
            .then(() => {
                message.success("Request has been sent");
                setIsModalOpen(false);
                setSelectedMyRideId(null);
            })
            .catch(() => {
                message.error("Match failed");
            });
    };

    const formatDateDDMMYYHHMM = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };



    // ✅ 表格列定义（只保留排序，本地完成）
    const columns = [
        { title: "RideID", dataIndex: "id", key: "id" },
        {
            title: "UserID",
            dataIndex: ["user", "id"],
            key: "userId",
            render: (text, record) => {
                // 如果没有 user，就用 userId 字段兜底
                const userId = record.user ? record.user.id : record.userId;

                if (!userId) return <span>-</span>; // 防御性兜底

                return userId !== currentUser.id ? (
                    <button onClick={() => navigate(`/chat/${userId}`)}>
                        {userId}
                    </button>
                ) : (
                    <span>Me</span>
                );
            },
        },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Location", dataIndex: "fromLocation", key: "fromLocation" },
        { title: "Destination", dataIndex: "toLocation", key: "toLocation" },
        {
            title: "Departure Time",
            dataIndex: "departureTime",
            key: "departureTime",
            render: (text) => formatDateDDMMYYHHMM(text),
            sorter: (a, b) => new Date(a.departureTime) - new Date(b.departureTime),
        },
        {
            title: "Available Seat",
            dataIndex: "seatsAvailable",
            key: "seatsAvailable",
            sorter: (a, b) => a.seatsAvailable - b.seatsAvailable,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Active", value: "active" },
                { text: "Completed", value: "completed" },
            ],
            onFilter: (value) => {
                handleStatusFilter(value);
                return true; // ✅ Antd 要求返回 true
            },
        },
        {
            title: "Operate",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    disabled={record.status !== "active" || record.seatsAvailable === 0}
                    onClick={() => openMatchModal(record)}
                >
                    Match
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Ride List</h2>

            {/* ✅ 搜索框 */}
            <Search
                placeholder="Search by location or destination"
                allowClear
                enterButton="Search"
                onSearch={handleSearch}
                style={{ marginBottom: 20, width: 400 }}
            />

            <Table
                rowKey="id"
                columns={columns}
                dataSource={rideInfo}
                pagination={{ pageSize: 10 }}
                loading={loading}
            />

            {/* 匹配弹窗 */}
            <Modal
                title="Select your ride for matching"
                open={isModalOpen}
                onOk={confirmMatch}
                onCancel={() => setIsModalOpen(false)}
            >
                <Select
                    style={{ width: "100%" }}
                    placeholder="Select your ride"
                    onChange={(value) => setSelectedMyRideId(value)}
                >
                    {rideInfo
                        .filter(
                            r =>
                                r.type !== targetRide?.type &&
                                r.status === "active" &&
                                r.user.id !== currentUser.id // currentUserId 就是 Redux 里的 user.id
                        )
                        .map((r) => (
                            <Option key={r.id} value={r.id}>
                                {r.type} | {r.fromLocation} → {r.toLocation} |{" "}
                                {r.departureTime}
                            </Option>
                        ))}
                </Select>
            </Modal>
        </div>
    );
};

export default RideList;
