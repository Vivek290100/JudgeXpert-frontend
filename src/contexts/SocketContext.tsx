import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import API_BASE_URL from "@/utils/axios/BaseURL";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/Store";
import { addNotification } from "@/redux/slices/notificationSlice";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
  if (!user) {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      console.log(`WebSocket disconnected due to no user`);
    }
    return;
  }

  const newSocket = io(API_BASE_URL, {
    query: { userId: user.id },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 30,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    timeout: 30000,
    transports: ["websocket"],
  });

  newSocket.on("connect", () => {
    console.log(`WebSocket connected for user ${user.id} (socket ${newSocket.id})`);
    // Request pending notifications
    newSocket.emit("requestPendingNotifications", user.id);
  });

  newSocket.on("contestStarted", (notification) => {
    console.log("Received contestStarted notification:", JSON.stringify(notification, null, 2));
    dispatch(addNotification(notification));
    toast.success(notification.message);
  });

    newSocket.on("connect_error", (error) => {
      console.error(`WebSocket connection error for user ${user.id}: ${error.message}`);
    });

    newSocket.on("reconnect_attempt", (attempt) => {
      console.log(`WebSocket reconnect attempt ${attempt} for user ${user.id}`);
    });

    newSocket.on("reconnect", () => {
      console.log(`WebSocket reconnected for user ${user.id}`);
    });

    newSocket.on("reconnect_failed", () => {
      console.error(`WebSocket reconnection failed for user ${user.id}`);
    });

    newSocket.on("messageReceived", (data) => {
      console.log(`Received discussion message for user ${user.id}:`, data);
    });

    newSocket.on("replyReceived", (data) => {
      console.log(`Received discussion reply for user ${user.id}:`, data);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !newSocket.connected) {
        // console.log(`Tab active, attempting WebSocket reconnect for user ${user.id}`);
        newSocket.connect();
      }
    };
    const handleFocus = () => {
      if (!newSocket.connected) {
        // console.log(`Window focused, attempting WebSocket reconnect for user ${user.id}`);
        newSocket.connect();
      }
    };

    const reconnectInterval = setInterval(() => {
      if (!newSocket.connected) {
        // console.log(`Periodic check: WebSocket disconnected for user ${user.id}, attempting reconnect`);
        newSocket.connect();
      }
    }, 5000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    setSocket(newSocket);

    return () => {
      clearInterval(reconnectInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user, dispatch]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);