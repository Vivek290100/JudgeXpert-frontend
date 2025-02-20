// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\thunks\authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse } from "../types/Index";
import { ForgotPasswordFormData, LoginFormData, SignUpFormData } from "@/utils/validations/AuthValidation";
import { VerifyOtpData } from "@/utils/validations/OTPVerifyValidation";
import { apiRequest } from "@/utils/axios/apiRequest";



export const signUp = createAsyncThunk<AuthResponse, SignUpFormData, { rejectValue: string }>(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    return apiRequest<AuthResponse>("post", "/signup", userData, rejectWithValue);
  }
);

export const verifyOtp = createAsyncThunk<AuthResponse, VerifyOtpData>(
  "auth/verifyOtp",
  async ({ otp, email }, { rejectWithValue }) => {
    return apiRequest<AuthResponse>("post", "/verify-otp", { otp, email }, rejectWithValue);
  }
);



export const resendOtp = createAsyncThunk<void, string>(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    return apiRequest<void>("post", "/resend-otp", { email }, rejectWithValue);
  }
);

export const login = createAsyncThunk<AuthResponse, LoginFormData>(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    return apiRequest<AuthResponse>("post", "/login", userData, rejectWithValue);
  }
);

export const forgotPassword = createAsyncThunk<void, ForgotPasswordFormData, { rejectValue: string }>(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    console.log("000000000000000",data);
    
    return apiRequest<void>("post", "/forgot-password", { email: data.email }, rejectWithValue);
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk<void, VerifyOtpData>(
  "auth/verifyForgotPasswordOtp",
  async ({ otp, email }, { rejectWithValue }) => {
    return apiRequest<void>("post", "/verify-forgot-password-otp", { otp, email }, rejectWithValue);
  }
);

export const resetPassword = createAsyncThunk<void, { email: string; newPassword: string; otp: string }, { rejectValue: string }>(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    return apiRequest<void>("post", "/reset-password", data, rejectWithValue);
  }
);



export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest("post", "/logout");
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);


