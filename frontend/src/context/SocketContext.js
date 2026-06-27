import { createContext, useContext, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const userSocketRef  = useRef(null);
  const managerSocketRef = useRef(null);

  if (!userSocketRef.current) {
    userSocketRef.current = io(SOCKET_URL, { query: { role: "user" }, autoConnect: false });
  }
  if (!managerSocketRef.current) {
    managerSocketRef.current = io(SOCKET_URL, { query: { role: "manager" }, autoConnect: false });
  }

  return (
    <SocketContext.Provider value={{ userSocket: userSocketRef.current, managerSocket: managerSocketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
