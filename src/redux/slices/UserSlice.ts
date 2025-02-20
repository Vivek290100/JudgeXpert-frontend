// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/UserTypes';

interface UserState {
  user: User | null;
  solvedProblems: string[];
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
    fetchUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
    },
    fetchUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    addSolvedProblem(state, action: PayloadAction<string>) {
      state.solvedProblems.push(action.payload);
    },
  },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, addSolvedProblem } = userSlice.actions;
export default userSlice.reducer;