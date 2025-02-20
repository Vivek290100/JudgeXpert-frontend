// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\thunks\authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios/AxiosInstance";
import { isAxiosError } from "axios";
import { AuthResponse } from "../types/Index";
import { LoginFormData, SignUpFormData } from "@/utils/validations/AuthValidation";
import { VerifyOtpData } from "@/utils/validations/OTPVerifyValidation";
// import { persistor } from "../Store";

// Define thunks here

 const signUp = createAsyncThunk<AuthResponse, SignUpFormData, { rejectValue: string }>(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    console.log("signup thunk0000000000000",userData);

    try {
      const response = await axiosInstance.post("/signup", userData);
      console.log("11111111111111111111111111", response);

      // Assuming the API response includes a token and user data
      const { email, userName, fullName, role, profileImage, problemsSolved, rank, joinedDate, token } = response.data;

      // Return the full AuthResponse object
      return {
        token: token,
        user: {
          email,
          userName,
          fullName,
          role,
          profileImage,
          problemsSolved: problemsSolved || 0,
          rank: rank || 0,
          joinedDate: joinedDate || new Date().toISOString(),
        },
      };
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Signup failed");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

 const verifyOtp = createAsyncThunk<AuthResponse, VerifyOtpData>(
  "auth/verifyOtp",
  async ({ otp, email }, { rejectWithValue }) => {
    console.log("verifyotp thunk");
    
    try {
      const response = await axiosInstance.post("/verify-otp", { otp, email });
      console.log("responseeeeeeeeeeeeeeeeeeeeeeee",response);
      
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "OTP verification failed");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

 const resendOtp = createAsyncThunk<void, string>(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      console.log("its resend otp thunk");
      
      await axiosInstance.post("/resend-otp", { email });
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to resend OTP");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

 const login = createAsyncThunk<AuthResponse, LoginFormData>(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    
    try {
      const response = await axiosInstance.post("/login", userData);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

 const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    console.log("its logout thunk");
    
    try {
      await axiosInstance.post("/logout");
      // Clear the access token cookie by making it expire
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("document.cookie",document.cookie);
      

      // await persistor.purge();

      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Logout failed");
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

// Re-export all thunks from this file
export {
  signUp,
  verifyOtp,
  resendOtp,
  login,
  logout,
};



