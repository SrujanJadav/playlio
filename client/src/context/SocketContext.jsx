import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

let SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// Vercel does not support WebSocket proxying on its edge network.
// If the socket URL points to Vercel, we must connect directly to the live Render backend.
if (SOCKET_URL.includes("vercel.app")) {
  SOCKET_URL = "https://playlio.onrender.com";
}

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [clockOffset, setClockOffset] = useState(0);

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    // Connect when user is logged in
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        console.log("🔌 Socket connected:", socketRef.current.id);
        setConnected(true);
        const sendTime = Date.now();
        socketRef.current.emit("sync_time_ping", { sendTime });
      });

      socketRef.current.on("sync_time_pong", ({ sendTime, serverTime }) => {
        const receiveTime = Date.now();
        const rtt = receiveTime - sendTime;
        const estimatedServerTime = serverTime + rtt / 2;
        const offset = estimatedServerTime - receiveTime;
        console.log(`⏰ Time Sync: RTT = ${rtt}ms, Clock Offset = ${offset}ms`);
        setClockOffset(offset);
      });

      socketRef.current.on("disconnect", () => {
        console.log("🔌 Socket disconnected");
        setConnected(false);
      });
    }

    return () => {
      // Don't disconnect on component unmount — keep connection alive
    };
  }, [user]);

  const serverNow = () => Date.now() + clockOffset;

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, clockOffset, serverNow }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
