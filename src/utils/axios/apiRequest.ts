// src/utils/axios/ApiRequest.ts
import axiosInstance from "@/utils/axios/AxiosInstance";
import { isAxiosError } from "axios";

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Makes an API request using the configured axios instance.
 * @param method - HTTP method ("get", "post", "put", "patch")
 * @param url - API endpoint URL
 * @param data - Request payload (optional)
 * @param rejectWithValue - Redux Toolkit's rejectWithValue function (optional)
 * @param config - Additional axios config (e.g., headers)
 * @returns Promise resolving to the response data
 */
export function apiRequest<T = unknown>(
  method: "get" | "post" | "put" | "patch",
  url: string,
  data?: any,
  rejectWithValue?: (value: string) => any,
  config?: { headers?: Record<string, string>; [key: string]: any }
): Promise<T> {
  return axiosInstance({
    method,
    url,
    data,
    ...config,
  })
    .then((response) => {
      console.log("API response:", response);
      return response.data as T;
    })
    .catch((error) => {
      if (isAxiosError(error)) {
        console.error("API Request Error:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "An error occurred";
        if (rejectWithValue) {
          return rejectWithValue(errorMessage);
        }
        throw new Error(errorMessage);
      }
      console.error("Unexpected Error:", error);
      throw error;
    });
}