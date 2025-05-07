import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const initializeSocket = (userId: string = ""): Socket => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: { userId },
  });

  socket.on("connect", () => {
    console.log(`Socket.IO connected, userId: ${userId || "anonymous"}`);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket.IO connect error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket.IO disconnected: ${reason}`);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};