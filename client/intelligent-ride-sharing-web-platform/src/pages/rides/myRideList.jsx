import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchRides, deleteRide, updateRide } from "../../store/modules/rideInfo";
import { getMatchesByUserAPI } from "../../apis/matches";
import { useNavigate } from "react-router-dom";

const RideDetail = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const rideInfo = useSelector((state) => state.rideInfo.rides);

    const [myRides, setMyRides] = useState([]);

    useEffect(() => {
        // 获取所有我创建的行程
        dispatch(fetchRides());
    }, [dispatch]);

    useEffect(() => {
        const fetchMatches = async () => {
            // 获取我匹配到的行程
            const res = await getMatchesByUserAPI(user.id);
            console.log(res)
            const matches = res || [];
            const created = rideInfo.filter(r => r.user.id === user.id);
            const matched = matches.map(m => m.ride);
            console.log(matched)
            setMyRides([...created, ...matched]);
        };

        if (rideInfo.length && user.id) fetchMatches();
    }, [rideInfo, user.id]);



    // 删除行程
    const handleDelete = async (id) => {
        try {
            await dispatch(deleteRide(id));
            message.success("Ride deleted successfully");
        } catch (err) {
            message.error("Delete failed");
        }
    };

    const navigate = useNavigate();
    const handleEdit = (id) => {
        navigate(`/rides/edit/${id}`);
    };

    const columns = [
        { title: "RideID", dataIndex: "id", key: "id" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "From", dataIndex: "fromLocation", key: "fromLocation" },
        { title: "To", dataIndex: "toLocation", key: "toLocation" },
        { title: "Departure", dataIndex: "departureTime", key: "departureTime" },
        { title: "Seats", dataIndex: "seatsAvailable", key: "seatsAvailable" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <>
                    {record.user.id === user.id && record.status === "active" ? (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleEdit(record.id)}
                            >
                                Edit
                            </Button>
                            <Popconfirm
                                title="Are you sure delete this ride?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button danger size="small" style={{ marginLeft: 8 }}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </>
                    ) : (
                        <span>不可操作</span>
                    )}
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Rides</h2>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={myRides}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};


export default RideDetail