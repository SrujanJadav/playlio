import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

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

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
