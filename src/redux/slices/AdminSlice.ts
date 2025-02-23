import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers, blockUser } from "../thunks/AdminThunks";

interface AdminUser {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  role: string;
  isBlocked: boolean;
  joinedDate: string;
}

interface AdminState {
  users: AdminUser[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<AdminUser[]>) => {
        state.users = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action: PayloadAction<{ userId: string; isBlocked: boolean }>) => {
        if (state.users) {
          const index = state.users.findIndex((user) => user.id === action.payload.userId);
          if (index !== -1) {
            state.users[index].isBlocked = action.payload.isBlocked;
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default adminSlice.reducer;