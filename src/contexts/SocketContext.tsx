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
        console.log("WebSocket disconnected due to no user");
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
      newSocket.emit("requestPendingNotifications", user.id);
    });

    newSocket.on("contestStarted", (notification) => {
      console.log("Received contestStarted notification:", JSON.stringify(notification, null, 2));
      // Log all keys to inspect structure
      console.log("Notification keys:", Object.keys(notification));
      // Temporarily relaxed validation for debugging
      if (notification) {
        try {
          // Normalize payload to match Notification interface
          const normalizedNotification = {
            type: notification.type || "contestStarted",
            contestId: notification.contestId?.toString() || "",
            title: notification.title || "Unknown Contest",
            message: notification.message || "Contest has started",
            timestamp: notification.timestamp || new Date().toISOString(),
          };
          dispatch(addNotification(normalizedNotification));
          toast.success(normalizedNotification.message, { duration: 5000 });
          console.log("Dispatched addNotification successfully:", normalizedNotification);
        } catch (error) {
          console.error("Error dispatching addNotification:", error);
        }
      } else {
        console.error("Invalid or null notification payload:", notification);
      }
    });

    newSocket.on("newProblem", (notification) => {
  console.log("Received newProblem notification:", JSON.stringify(notification, null, 2));
  if (notification) {
    try {
      const normalizedNotification = {
        type: "newProblem",
        contestId: "", // No contestId for newProblem, set as empty
        title: notification.title || "New Problem Added",
        message: notification.message || `New problem ${notification.slug} is available`,
        timestamp: notification.timestamp || new Date().toISOString(),
      };
      dispatch(addNotification(normalizedNotification));
      toast.success(normalizedNotification.message, {
        id: `new-problem-${notification.slug}`,
        duration: 5000,
      });
      console.log("Dispatched newProblem notification:", normalizedNotification);
    } catch (error) {
      console.error("Error dispatching newProblem notification:", error);
    }
  } else {
    console.error("Invalid or null newProblem notification payload:", notification);
  }
});

    newSocket.on("connect_error", (error) => {
      console.error(`WebSocket connection error for user ${user.id}: ${error.message}`);
    });

    newSocket.on("reconnect", () => {
      console.log(`WebSocket reconnected for user ${user.id}`);
      newSocket.emit("requestPendingNotifications", user.id);
    });

    newSocket.on("reconnect_failed", () => {
      console.error(`WebSocket reconnection failed for user ${user.id}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      console.log("WebSocket disconnected");
    };
  }, [user, dispatch]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);