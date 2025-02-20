// import axiosInstance from "@/utils/axios/AxiosInstance";
// import { isAxiosError } from "axios";

// export async function apiRequest<T>(
//   method: "post" | "get",
//   url: string,
//   data?: any,
//   rejectWithValue?: (value: string) => any
// ): Promise<T | any> {
//   try {
//     const response = await axiosInstance[method](url, data);
//     console.log("jjjjjjjjjjjjjjjjjjjj",response);
    
//     return response.data;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       return rejectWithValue ? rejectWithValue(error.response?.data?.message || "Request failed") : null;
//     }
//     return rejectWithValue ? rejectWithValue("Unexpected error occurred") : null;
//   }
// }

// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\utils\axios\apiRequest.ts
import axiosInstance from "@/utils/axios/AxiosInstance";
import { isAxiosError } from "axios";

export async function apiRequest<T>(
  method: "post" | "get",
  url: string,
  data?: any,
  rejectWithValue?: (value: string) => any
): Promise<T> {
    console.log("its apirequestttttttttttttttttttttttttt");
    
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
    });

    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwww",response);
    
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("API Request Error:", error.response?.data || error.message);
      return rejectWithValue ? rejectWithValue(error.response?.data?.message || "An error occurred") : Promise.reject(error);
    }
    return Promise.reject(error);
  }
}
