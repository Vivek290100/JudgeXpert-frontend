import axios from "axios";
import API_BASE_URL from "./BaseURL";
import { logout } from "@/redux/thunks/AuthThunks";
import store from "@/redux/Store";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config, code, message } = error;

    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("Missing user ID");

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { userId },
          { withCredentials: true }
        );

        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(config);
      } catch (refreshError) {
        localStorage.removeItem("userId");
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const isServerDown =
      code === "ECONNABORTED" ||
      message.includes("Network Error") ||
      [502, 503, 504].includes(response?.status);

    if (isServerDown) {
      localStorage.setItem("server_down_redirect", window.location.pathname);
      window.location.replace("/server-down");
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

