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
  IProblem,
  ProcessProblemPayload,
  { rejectValue: string }
>(
  "problems/processSpecific",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiRequest<ProcessProblemResponse>(
        "post",
        "/admin/problems/single", // Corrected endpoint
        payload,
        rejectWithValue,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (!response.data || !response.data.problem) {
        return rejectWithValue("Invalid response structure: no problem data");
      }

      return {
        id: response.data.problem.id,
        title: response.data.problem.title,
        slug: response.data.problem.slug,
      } as IProblem;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process problem";
      return rejectWithValue(message);
    }
  }
);
