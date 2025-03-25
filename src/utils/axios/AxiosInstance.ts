// Frontend\src\utils\axios\AxiosInstance.ts
import axios from "axios";
import API_BASE_URL from "./BaseURL";
import { logout } from "@/redux/thunks/AuthThunks";
import store from "@/redux/Store";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // e.g., "http://localhost:5000"
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("401 detected, attempting to refresh token");

      try {
        // Get userId from localStorage (set this during login)
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { userId },
          { withCredentials: true }
        );

        console.log("Refresh successful, new token:", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        localStorage.removeItem("userId");
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;