import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signUp, verifyOtp, logout, login, googleLogin } from "../thunks/AuthThunks";
import { AuthResponse, AuthState, AuthUser } from "../../types/Index";
import { updateUserProfile } from "../thunks/UserThunks";



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
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
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
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        updateAuthState(state, action.payload);
      })
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
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload ?? "Failed to update profile";
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

const updateAuthState = (state: AuthState, payload: AuthResponse) => {
  if (!payload || !payload.data || !payload.data.user) return;

  state.token = payload.token ?? null;
  state.isAuthenticated = true;
  state.user = payload.data.user;
  state.loading = false;
  state.error = null;
};

export default authSlice.reducer;