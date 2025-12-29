import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import io from "socket.io-client";
import L from "leaflet";
import AutoCenter from "./AutoCente";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  path: "/socket.io",
  transports: ["websocket"]
});

const bikeIcon = new L.Icon({
  iconUrl: "/bike.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

export default function Customer() {
  const [deliveryId, setDeliveryId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    socket.on("deliveryLocation", (data) => {
      setPos([data.lat, data.lng]);
    });
  }, []);

  const startTracking = () => {
    if (!deliveryId.trim()) {
      alert("Enter delivery code");
      return;
    }
    socket.emit("joinDelivery", deliveryId);
    setTracking(true);
  };

  return (
    <div>
      <div style={{ padding: 10 }}>
        {!tracking ? (
          <>
            <input
              placeholder="Enter Delivery Code"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
            />
            <button onClick={startTracking}>
              Track
            </button>
          </>
        ) : (
          <p>📦 Tracking delivery <b>{deliveryId}</b></p>
        )}
      </div>

      {pos && (
        <MapContainer
          center={pos}
          zoom={16}
          style={{ height: "90vh" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AutoCenter position={pos} />
          <Marker position={pos} icon={bikeIcon} />
        </MapContainer>
      )}
    </div>
  );
}
