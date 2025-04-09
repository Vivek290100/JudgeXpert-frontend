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

    // Handle 401: Attempt token refresh
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

    // Handle server down
    const isServerDown =
      code === "ECONNABORTED" ||
      message.includes("Network Error") ||
      [502, 503, 504].includes(response?.status);

    if (isServerDown) {
      localStorage.setItem("server_down_redirect", window.location.pathname);
      window.location.replace("/server-down");
      return new Promise(() => {}); // Freeze request chain
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;


// import axios from "axios";
// import API_BASE_URL from "./BaseURL";
// import { logout } from "@/redux/thunks/AuthThunks";
// import store from "@/redux/Store";

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       console.log("401 detected, attempting to refresh token");

//       try {
//         const userId = localStorage.getItem("userId");
//         if (!userId) {
//           throw new Error("No user ID found. Please log in again.");
//         }

//         const { data } = await axios.post(
//           `${API_BASE_URL}/auth/refresh-token`,
//           { userId },
//           { withCredentials: true }
//         );

//         console.log("Refresh successful, new token:", data.accessToken);
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh failed:", refreshError);
//         localStorage.removeItem("userId");
//         document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         store.dispatch(logout());
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     const isServerDown =
//       error.code === "ECONNABORTED" ||
//       error.message.includes("Network Error") ||
//       [502, 503, 504].includes(error.response?.status);

//     if (isServerDown) {
//       // Prevent rendering by storing flag immediately
//       localStorage.setItem("server_down_redirect", window.location.pathname);
//       window.location.replace("/server-down"); // <-- replace to avoid back button glitches
//       return new Promise(() => {}); // 👈 Freeze here. Never return an error.
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;