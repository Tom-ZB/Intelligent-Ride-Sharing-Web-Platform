import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchMatchesByUser,
    changeMatchStatus,
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

    const formatDateDDMMYYHHMM = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;       // dd/mm/yy hh:mm
    };


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
            .map(r => ({ ...r, type: "created",offer_seats_available: r.seatsAvailable,request_seats_available: r.seatsAvailable}));

        const matched = matches.map(m => {
            const isOffer = m.offer_user_id === user.id;
            const offerRide = rides.find(r => r.id === m.ride_offer_id);
            const requestRide = rides.find(r => r.id === m.ride_request_id);

            return {
                id: m.id,
                fromLocation: isOffer ? m.offer_from : m.request_from,
                toLocation: isOffer ? m.offer_to : m.request_to,
                departureTime: offerRide ? offerRide.departureTime : null,
                offer_seats_available: offerRide ? offerRide.seatsAvailable : null,
                request_seats_available: requestRide ? requestRide.seatsAvailable : null,
                status: m.status,
                type: "matched",
                offer_user_id: m.offer_user_id,
                request_user_id: m.request_user_id,
                initiator_user_id: m.initiator_user_id,   // 带上发起方
                offer_from: m.offer_from,
                offer_to: m.offer_to,
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

    const handleAccept = async (match) => {  try {
        const res = await dispatch(changeMatchStatus(match.id, "confirmed"));

        if (res?.success === false) {
            Modal.warning({
                title: "Cannot Accept Match",
                content: res.message,
            });
            return;
        }

        message.success("Match accepted");
        dispatch(fetchRides()); //重新拉取 rides，刷新座位数
    } catch (err) {
        console.error(err);
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
        { title: "DepartureTime", dataIndex: "departureTime", key: "departureTime",render: (text) => formatDateDDMMYYHHMM(text) },
        { title: "Seats Available", dataIndex: "offer_seats_available", key: "offer_seats_available" },
        { title: "Seats Requested", dataIndex: "request_seats_available", key: "request_seats_available" },
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
                    ) : <span>No Operation</span>;
                } else if (record.type === "matched") {
                    const isInitiator = record.initiator_user_id === user.id;

                    if (isInitiator) {
                        // 我是发起方 → 只能看到状态
                        return <span>{record.status}</span>;
                    }

                    if (!isInitiator && record.status === "pending") {
                        // 我是接收方 → 可以操作
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
                    }

                    return <span>{record.status}</span>;
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
        <div className="ride-detail">
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
                                <p><strong>Seats Requested:</strong> {selectedMatch.request_seats_available}</p>
                                <p><strong>Status:</strong> {selectedMatch.status}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>From:</strong> {selectedMatch.fromLocation} → {selectedMatch.toLocation}</p>
                                <p><strong>Seats Available:</strong> {selectedMatch.offer_seats_available}</p>
                                <p><strong>Seats Requested:</strong> {selectedMatch.request_seats_available}</p>
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
