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
      if (!state.notifications.some((n) => n.contestId === action.payload.contestId)) {
        state.notifications.push(action.payload);
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;