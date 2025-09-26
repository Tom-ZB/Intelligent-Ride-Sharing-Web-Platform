import React, { useState, useEffect } from "react";
import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
    DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const center = { lat: -40.9006, lng: 174.886 };

// 🔹 自动补全输入框组件
function LocationInput({ label, value, onChange }) {
    const [suggestions, setSuggestions] = useState([]);

    const handleInput = (e) => {
        const input = e.target.value;
        onChange(input);

        if (!input) {
            setSuggestions([]);
            return;
        }

        // 使用 Google Places AutocompleteService
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
            { input, types: ["(cities)"] }, // 只提示城市
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            }
        );
    };

    return (
        <div style={{ position: "relative", marginBottom: "10px" }}>
            <label>{label}</label>
            <input type="text" value={value} onChange={handleInput} />

            {suggestions.length > 0 && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 1000,
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        maxHeight: "150px",
                        overflowY: "auto",
                    }}
                >
                    {suggestions.map((s) => (
                        <li
                            key={s.place_id}
                            style={{ padding: "8px", cursor: "pointer" }}
                            onClick={() => {
                                onChange(s.description);
                                setSuggestions([]);
                            }}
                        >
                            {s.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function MapPage() {
    const [fromName, setFromName] = useState("");
    const [toName, setToName] = useState("");
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [directions, setDirections] = useState(null);
    const [tripInfo, setTripInfo] = useState(null);

    const [events, setEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // ✅ 保留 NZTA API 请求
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const resp = await fetch(
                    "https://trafficnz.info/service/traffic/rest/4/events/all/10",
                    { headers: { Accept: "application/json" } }
                );
                if (!resp.ok) throw new Error("failed to fetch");

                const data = await resp.json();
                const allEvents = data.response?.roadevent || [];

                setEvents(allEvents);
                setDisplayedEvents(allEvents.slice(0, 10));
            } catch (err) {
                console.error("failed to load:", err);
            }
        };

        fetchEvents();
    }, []);

    // 🔍 使用 Google Geocoding API 将地名转经纬度
    const geocode = async (placeName) => {
        const resp = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                placeName
            )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );

        const data = await resp.json();
        if (data.status === "OK") {
            const loc = data.results[0].geometry.location;
            return { lat: loc.lat, lng: loc.lng };
        }
        return null;
    };

    // 🚗 提交表单 -> 规划路线
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fromCoords = await geocode(fromName);
        const toCoords = await geocode(toName);

        if (!fromCoords || !toCoords) {
            alert("无法找到地点，请输入更详细的信息");
            return;
        }

        setFrom(fromCoords);
        setTo(toCoords);

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: fromCoords,
                destination: toCoords,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK") {
                    setDirections(result);
                    const leg = result.routes[0].legs[0];
                    setTripInfo({
                        distanceKm: leg.distance.text,
                        durationMin: leg.duration.text,
                    });
                } else {
                    console.error("Directions request failed:", status);
                }
            }
        );
    };

    return (
        <div className="map-page" style={{ display: "flex", height: "100vh" }}>
            {/* 左侧控制面板 */}
            <div className="control-panel" style={{ width: "30%", padding: "10px", overflowY: "auto" }}>
                <h3>Route planning</h3>
                <form onSubmit={handleSubmit}>
                    <LocationInput label="Starting location:" value={fromName} onChange={setFromName} />
                    <LocationInput label="Destination location:" value={toName} onChange={setToName} />
                    <button type="submit">Plot a route</button>
                </form>

                {tripInfo && (
                    <div className="trip-info">
                        <h4>Journey information</h4>
                        <p>Distance: {tripInfo.distanceKm}</p>
                        <p>Estimated duration: {tripInfo.durationMin}</p>
                    </div>
                )}

                <h4>Traffic Events</h4>
                {displayedEvents.map((event) => (
                    <div
                        key={event.id}
                        style={{ padding: "10px", borderBottom: "1px solid #eee", cursor: "pointer" }}
                        onClick={() => setSelectedEvent(event)}
                    >
                        <strong>{event.eventType}</strong> — {event.eventDescription}
                        <br />
                        <small>
                            Road: {event.journey?.name || "unknown"}, status: {event.status}
                        </small>
                    </div>
                ))}
            </div>

            {/* 右侧地图 */}
            <div className="map-container" style={{ flex: 1 }}>
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    libraries={["places"]}
                >
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
                        {from && <Marker position={from} />}
                        {to && <Marker position={to} />}
                        {directions && <DirectionsRenderer directions={directions} />}

                        {displayedEvents.map((event) => {
                            if (!event.latitude || !event.longitude) return null;
                            return (
                                <Marker
                                    key={event.id}
                                    position={{
                                        lat: parseFloat(event.latitude),
                                        lng: parseFloat(event.longitude),
                                    }}
                                    onClick={() => setSelectedEvent(event)}
                                />
                            );
                        })}

                        {selectedEvent && (
                            <InfoWindow
                                position={{
                                    lat: parseFloat(selectedEvent.latitude),
                                    lng: parseFloat(selectedEvent.longitude),
                                }}
                                onCloseClick={() => setSelectedEvent(null)}
                            >
                                <div>
                                    <strong>{selectedEvent.eventType}</strong>
                                    <p>{selectedEvent.eventDescription}</p>
                                    <small>
                                        Road: {selectedEvent.journey?.name || "unknown"} <br />
                                        Status: {selectedEvent.status}
                                    </small>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}

export default MapPage;
