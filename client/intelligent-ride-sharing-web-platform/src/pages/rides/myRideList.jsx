import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchMatchesByUser,
    changeMatchStatus,
    deleteMatch
} from "../../store/modules/matches";
import { fetchRides, deleteRide } from "../../store/modules/rideInfo";

const RideDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.userInfo);
    const rides = useSelector((state) => state.rideInfo.rides);
    const matches = useSelector((state) => state.matches.matches);

    const [myRides, setMyRides] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    // 加载用户行程和匹配
    useEffect(() => {
        if (user.id) {
            dispatch(fetchRides());
            dispatch(fetchMatchesByUser(user.id));
        }
    }, [dispatch, user.id]);

    useEffect(() => {
        if (!user.id) return;

        const created = rides
            .filter(r => r.user.id === user.id)
            .map(r => ({ ...r, type: "created" }));

        const matched = matches.map(m => {
            const isOffer = m.offer_user_id === user.id; // 当前用户是车主
            const seatsAvailable = isOffer ? m.raw?.offer_seats_available || m.seatsAvailable : m.raw?.request_seats_available || m.seatsAvailable;

            return {
                id: m.id,
                fromLocation: isOffer ? m.offer_from : m.request_from,
                toLocation: isOffer ? m.offer_to : m.request_to,
                departureTime: m.match_time,
                seatsAvailable,
                status: m.status,
                type: "matched",
                offer_user_id: m.offer_user_id,
                offer_from: m.offer_from,
                offer_to: m.offer_to,
                request_user_id: m.request_user_id,
                request_from: m.request_from,
                request_to: m.request_to,
                raw: m
            };
        });

        setMyRides([...created, ...matched]);
    }, [rides, matches, user.id]);

    // 行程操作
    const handleEdit = (id) => navigate(`/rides/edit/${id}`);

    const handleDeleteRide = async (id) => {
        try {
            await dispatch(deleteRide(id));
            message.success("Ride deleted");
        } catch {
            message.error("Delete failed");
        }
    };

    const handleAccept = async (match) => {
        try {
            // 根据业务逻辑可以传 seatsUpdated 等参数到后端
            // seatsTaken 根据匹配对象确定是 request 还是 offer
            const seatsTaken = match.request_user_id === user.id
                ? match.offer_seats_available
                : match.request_seats_available;

            const res = await dispatch(changeMatchStatus(match.id, "accepted"));

            if (res.success === false) {
                Modal.warning({
                    title: "Cannot Accept Match",
                    content: res.message,
                });
            }

            message.success("Match accepted");
        } catch {
            message.error("Accept failed");
        }
    };

    const handleReject = async (match) => {
        try {
            await dispatch(changeMatchStatus(match.id, "cancelled"));
            message.success("Match cancelled");
        } catch {
            message.error("Reject failed");
        }
    };

    const handleViewDetails = record => {
        setSelectedMatch(record);
        setModalVisible(true);
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "From", dataIndex: "fromLocation", key: "fromLocation" },
        { title: "To", dataIndex: "toLocation", key: "toLocation" },
        { title: "Departure", dataIndex: "departureTime", key: "departureTime" },
        { title: "Seats", dataIndex: "seatsAvailable", key: "seatsAvailable" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                if (record.type === "created") {
                    return record.status === "active" ? (
                        <>
                            <Button type="primary" size="small" onClick={() => handleEdit(record.id)}>
                                Edit
                            </Button>
                            <Popconfirm title="Are you sure delete this ride?" onConfirm={() => handleDeleteRide(record.id)}>
                                <Button danger size="small" style={{ marginLeft: 8 }}>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </>
                    ) : <span>不可操作</span>;
                } else if (record.type === "matched") {
                    if (record.offer_user_id === user.id && record.status === "pending") {
                        return (
                            <>
                                <Button type="primary" size="small" onClick={() => handleAccept(record)}>
                                    Accept
                                </Button>
                                <Button danger size="small" style={{ marginLeft: 8 }} onClick={() => handleReject(record)}>
                                    Reject
                                </Button>
                            </>
                        );
                    } else if (record.request_user_id === user.id) {
                        return <span>{record.status}</span>;
                    } else {
                        return <span>不可操作</span>;
                    }
                }
            }
        },
        {
            title: "Details",
            key: "details",
            render: (_, record) => (
                <Button size="small" onClick={() => handleViewDetails(record)}>View</Button>
            )
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>My Rides</h2>
            <Table rowKey="id" columns={columns} dataSource={myRides} pagination={{ pageSize: 10 }} />

            <Modal
                title="Ride / Match Details"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                {selectedMatch && (
                    <div>
                        {selectedMatch.type === "matched" ? (
                            <>
                                <p><strong>Offer From:</strong> {selectedMatch.offer_from} → {selectedMatch.offer_to}</p>
                                <p><strong>Request From:</strong> {selectedMatch.request_from} → {selectedMatch.request_to}</p>
                                <p><strong>Seats Requested:</strong> {selectedMatch.seatsAvailable}</p>
                                <p><strong>Status:</strong> {selectedMatch.status}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>From:</strong> {selectedMatch.fromLocation} → {selectedMatch.toLocation}</p>
                                <p><strong>Seats Available:</strong> {selectedMatch.seatsAvailable}</p>
                                <p><strong>Status:</strong> {selectedMatch.status}</p>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RideDetail;
