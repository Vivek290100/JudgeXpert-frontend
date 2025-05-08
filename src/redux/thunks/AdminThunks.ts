import { createAsyncThunk } from "@reduxjs/toolkit";
import { AdminUser, AdminUsersResponse, BlockUserResponse } from "../../types/AdminTypes";
import { apiRequest } from "@/utils/axios/ApiRequest";

export const fetchUsers = createAsyncThunk<AdminUser[], void, { rejectValue: string }>(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest<AdminUsersResponse>("get", "/admin/users");

      if (!response.users || !Array.isArray(response.users)) {
        return rejectWithValue("Invalid response structure");
      }

      return response.users;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);


export const blockUser = createAsyncThunk<
  { userId: string; isBlocked: boolean },
  { userId: string; isBlocked: boolean },
  { rejectValue: string }
>(
  "admin/blockUser",
  async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {
      const endpoint = isBlocked ? `/admin/users/${userId}/block` : `/admin/users/${userId}/unblock`;
      const response = await apiRequest<BlockUserResponse>("post", endpoint);

      if (!response.userId || typeof response.userId !== "string") {
        return rejectWithValue("Invalid response structure");
      }

      return { userId: response.userId, isBlocked: response.isBlocked };
    } catch (error) {
      return rejectWithValue(`Failed to ${isBlocked ? "block" : "unblock"} user`);
    }
  }
);
