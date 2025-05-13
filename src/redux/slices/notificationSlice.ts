import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  type: string;
  contestId: string;
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      console.log("Before adding notification:", state.notifications);
      console.log("Adding notification:", action.payload);
      // Check for existing notification with same contestId and type
      const existingIndex = state.notifications.findIndex(
        (n) => n.contestId === action.payload.contestId && n.type === action.payload.type
      );
      if (existingIndex >= 0) {
        // Update existing notification
        state.notifications[existingIndex] = action.payload;
        console.log("Updated existing notification:", action.payload.contestId);
      } else {
        // Add new notification
        state.notifications.push(action.payload);
        console.log("Added new notification:", action.payload.contestId);
      }
      console.log("Current notifications:", state.notifications);
    },
    clearNotifications(state) {
      console.log("Clearing notifications. Previous:", state.notifications);
      state.notifications = [];
      console.log("Notifications cleared");
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;