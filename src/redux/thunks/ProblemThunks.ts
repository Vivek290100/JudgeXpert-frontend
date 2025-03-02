// src/redux/thunks/ProblemThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { IProblem } from "../types/Index"; // Adjust the import path based on your types location

interface ProcessProblemPayload {
  problemDir: string; // The directory path (e.g., "src/problems/two-sum")
}

interface ProcessProblemResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    problem: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

export const processSpecificProblem = createAsyncThunk<
  IProblem, // Return type: the processed problem (simplified for Redux)
  ProcessProblemPayload, // Payload type: problemDir
  { rejectValue: string } // Reject value type: error message
>(
  "problems/processSpecific", // Action type
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiRequest<ProcessProblemResponse>(
        "post",
        "/problems/single", 
        payload, 
        rejectWithValue,
        {
          headers: {
            "Content-Type": "application/json", // Adjust if needed (e.g., multipart/form-data)
          },
          timeout: 10000, // Optional: 10-second timeout
        }
      );

      console.log("process problem response", response);
      

      if (!response.data || !response.data.problem) {
        return rejectWithValue("Invalid response structure: no problem data");
      }

      // Return the problem data for Redux state
      return {
        id: response.data.problem.id,
        title: response.data.problem.title,
        slug: response.data.problem.slug,
        // Add other IProblem fields if needed (e.g., difficulty, testCases, defaultCode)
        // For simplicity, we’ll assume only id, title, and slug are stored in Redux
      } as IProblem;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process problem";
      return rejectWithValue(message);
    }
  }
);