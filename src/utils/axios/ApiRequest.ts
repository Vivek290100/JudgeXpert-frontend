import axiosInstance from "@/utils/axios/AxiosInstance";
import { isAxiosError } from "axios";

export async function apiRequest<T>(method: "post" | "get" | "put" | "patch", url: string, data?: any, rejectWithValue?: (value: string) => any, config?: { headers?: Record<string, string>; [key: string]: any }): Promise<T> {
  
  try {
    const response = await axiosInstance({
      method, url, data, ...config,
    });
    
    console.log("Api response", response);

    return response.data; 
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("API Request Error:", error.response?.data || error.message);
      return rejectWithValue ? rejectWithValue(error.response?.data?.message || "An error occurred"): Promise.reject(error);
    }
    return Promise.reject(error);
  }
}
