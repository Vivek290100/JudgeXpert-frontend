// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\slices\authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signUp, verifyOtp, logout, login } from "../thunks/AuthThunks";
import { AuthResponse } from "../types/Index";

interface User {
  email: string;
  userName: string;
  fullName: string;
  role: string;
  profileImage: string;
  problemsSolved: number;
  rank: number;
  joinedDate: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Handle pending states
    .addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      // Handle fulfilled states
      .addCase(signUp.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        updateAuthState(state, action.payload);
      })
      
      .addCase(verifyOtp.fulfilled, (state, action) => {
        updateAuthState(state, action.payload);
      })
      .addCase(login.fulfilled, (state, action) => {
        updateAuthState(state, action.payload);
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      })

      // Handle rejected states
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
    },
  });
  
  const updateAuthState = (state: AuthState, payload: AuthResponse) => {
    if (!payload || !payload.data || !payload.data.user) return;
  
    state.token = payload.token ?? null;
    state.isAuthenticated = true;
    state.user = payload.data.user;  // Ensure correct access
    state.loading = false;
    state.error = null;
  };
  

  
  export default authSlice.reducer;
  
  