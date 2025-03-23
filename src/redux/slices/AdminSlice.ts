//Frontend\src\redux\slices\AdminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers, blockUser } from '../thunks/AdminThunks';
import { AdminState, AdminUser } from '../../types/AdminTypes';



const initialState: AdminState = {
  users: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
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
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload ?? 'Failed to fetch users'; // Handle undefined payload with a default message
        state.loading = false;
      })
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action: PayloadAction<{ userId: string; isBlocked: boolean }>) => {
        if (state.users) {
          const user = state.users.find((u) => u.id === action.payload.userId);
          if (user) user.isBlocked = action.payload.isBlocked;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(blockUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload ?? 'Failed to update user block status'; // Handle undefined payload with a default message
        state.loading = false;
      });
  },
});

export default adminSlice.reducer;