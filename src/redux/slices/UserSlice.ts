// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../types/AuthTypes';
import { updateUserProfile } from '../thunks/UserThunks';

interface UserState {
  user: AuthUser | null; // The authenticated user's profile
  solvedProblems: string[]; // Track solved problem IDs
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  solvedProblems: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addSolvedProblem(state, action: PayloadAction<string>) {
      state.solvedProblems.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload ?? 'Failed to update profile';
        state.loading = false;
      });
  },
});

export const { addSolvedProblem } = userSlice.actions;
export default userSlice.reducer;