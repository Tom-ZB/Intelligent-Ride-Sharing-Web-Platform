import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "./index.scss";


// 地名 -> 经纬度
async function geocode(placeName) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`
    );
    const data = await res.json();
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
}

function MapPage() {
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [fromName, setFromName] = useState("");
    const [toName, setToName] = useState("");
    const [tripInfo, setTripInfo] = useState(null);

    const routingControlRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fromCoords = await geocode(fromName);
        const toCoords = await geocode(toName);

        if (!fromCoords || !toCoords) {
            alert("failed to find this place, please input more detailed information");
            return;
        }

        setFrom(fromCoords);
        setTo(toCoords);
        setTripInfo(null);
    };

    const RoutingMachine = () => {
        const map = useMap();

        useEffect(() => {
            if (!map || !from || !to) return;

            if (!routingControlRef.current) {
                // 初次创建 routingControl
                routingControlRef.current = L.Routing.control({
                    waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
                    router: L.Routing.osrmv1({
                        serviceUrl: "https://router.project-osrm.org/route/v1",
                    }),
                    lineOptions: {
                        styles: [{ color: "blue", weight: 4 }],
                    },
                    show: false,
                    addWaypoints: false,
                })
                    .on("routesfound", function (e) {
                        const route = e.routes[0];
                        const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
                        const durationMin = Math.round(route.summary.totalTime / 60);
                        setTripInfo({ distanceKm, durationMin });
                    })
                    .addTo(map);
            } else {
                // 已存在 routingControl，直接更新 waypoints
                routingControlRef.current.setWaypoints([L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)]);
            }
        }, [map, from, to]);

        return null;
    };

    return (
        <div className="map-page">
            <div className="control-panel">
                <h3>Route planning</h3>
                <form onSubmit={handleSubmit}>
                    <label>Starting location: </label>
                    <input
                        type="text"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        placeholder="Starting location"
                        required
                    />
                    <label>Destination location: </label>
                    <input
                        type="text"
                        value={toName}
                        onChange={(e) => setToName(e.target.value)}
                        placeholder="Destination location"
                        required
                    />
                    <button type="submit">Plot a route</button>
                </form>

                {tripInfo && (
                    <div className="trip-info">
                        <h4>Journey information</h4>
                        <p>Distance: {tripInfo.distanceKm} km</p>
                        <p>Estimated duration: {tripInfo.durationMin} minutes</p>
                    </div>
                )}
            </div>

            <div className="map-container">
                <MapContainer center={[-40.9006, 174.886]} zoom={6} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {from && to && <RoutingMachine />}

                    {from && (
                        <Marker position={[from.lat, from.lng]}>
                            <Popup>Starting point: {fromName}</Popup>
                        </Marker>
                    )}
                    {to && (
                        <Marker position={[to.lat, to.lng]}>
                            <Popup>Arrival point: {toName}</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapPage;
