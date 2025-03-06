// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\utils\axios\AxiosInstance.ts
import axios from "axios";
import API_BASE_URL from "./BaseURL";
import Cookies from "js-cookie"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor: Attach token from cookie to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");  // Get the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle expired token (401) and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post("/auth/refresh-token");
        
        Cookies.set("accessToken", data.accessToken, { expires: 30 }); 
        
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Please log in again.");
        Cookies.remove("accessToken");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

