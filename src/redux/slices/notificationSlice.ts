import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  type: string;
  contestId: string;
  title: string;
  message: string;
  timestamp: string;
  slug?: string; // Optional for newProblem notifications
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
      const existingIndex = state.notifications.findIndex(
        (n) =>
          (n.contestId && n.contestId === action.payload.contestId && n.type === action.payload.type) ||
          (n.slug && n.slug === action.payload.slug && n.type === action.payload.type)
      );
      if (existingIndex >= 0) {
        state.notifications[existingIndex] = action.payload;
        console.log("Updated existing notification:", action.payload.slug || action.payload.contestId);
      } else {
        state.notifications.push(action.payload);
        console.log("Added new notification:", action.payload.slug || action.payload.contestId);
      }
      console.log("Current notifications:", state.notifications);
    },
    removeNotification(state, action: PayloadAction<{ slug?: string; contestId?: string; type: string }>) {
      state.notifications = state.notifications.filter(
        (n) =>
          !(
            (n.slug && n.slug === action.payload.slug && n.type === action.payload.type) ||
            (n.contestId && n.contestId === action.payload.contestId && n.type === action.payload.type)
          )
      );
      console.log("Removed notification:", action.payload);
    },
    clearNotifications(state) {
      console.log("Clearing notifications. Previous:", state.notifications);
      state.notifications = [];
      console.log("Notifications cleared");
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;