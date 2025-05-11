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
      console.log("Adding notification:", action.payload);
      if (!state.notifications.some((n) => n.contestId === action.payload.contestId)) {
        state.notifications.push(action.payload);
        console.log("Notification added. Current notifications:", state.notifications);
      } else {
        console.log("Notification skipped (duplicate contestId):", action.payload.contestId);
      }
    },
    clearNotifications(state) {
      console.log("Clearing notifications. Previous notifications:", state.notifications);
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;