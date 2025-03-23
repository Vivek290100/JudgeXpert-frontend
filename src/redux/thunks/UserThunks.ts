// src/redux/thunks/UserThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthUser, AuthResponse } from "../types/AuthTypes";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { UpdateProfileData } from "../types/UserTypes";



export const updateUserProfile = createAsyncThunk<
  AuthUser,
  UpdateProfileData,
  { rejectValue: string }
>(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    console.log("its update profile thunk", profileData);

    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      if (profileData.github) formData.append("github", profileData.github);
      if (profileData.linkedin) formData.append("linkedin", profileData.linkedin);
      if (profileData.profileImage instanceof File) {
        formData.append("profileImage", profileData.profileImage);
      } else if (typeof profileData.profileImage === "string") {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await apiRequest<AuthResponse>(
        "put",
        "/update-profile",
        formData,
        rejectWithValue,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000,
        }
      );

      console.log("Update Profile Frontend Response:", response)
      return response.data.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      return rejectWithValue(message);
    }
  }
);

