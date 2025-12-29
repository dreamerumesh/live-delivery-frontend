import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  path: "/socket.io",
  transports: ["websocket"]
});

export default function Delivery() {
  const [deliveryId, setDeliveryId] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("locationUpdate", {
          deliveryId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      console.log,
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [started, deliveryId]);

  const startSharing = () => {
    if (!deliveryId.trim()) {
      alert("Enter delivery code");
      return;
    }
    setStarted(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🚴 Delivery Person</h2>

      {!started ? (
        <>
          <input
            placeholder="Enter Delivery Code (e.g. DEL101)"
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
          />
          <br /><br />
          <button onClick={startSharing}>
            Start Sharing Location
          </button>
        </>
      ) : (
        <p>📍 Live tracking started for <b>{deliveryId}</b></p>
      )}
    </div>
  );
}
