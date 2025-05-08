import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/utils/axios/ApiRequest.ts";
import { IProblem, ProcessProblemPayload, ProcessProblemResponse } from "@/types/ProblemTypes";


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
        "/admin/problems/single",
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
