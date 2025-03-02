// src/redux/slices/ProblemSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { processSpecificProblem } from "../thunks/ProblemThunks";
import { IProblem } from "../types/Index"; // Adjust the import path based on your types

interface ProblemState {
  problems: IProblem[]; // Store processed problems
  loading: boolean;
  error: string | null;
}

const initialState: ProblemState = {
  problems: [],
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    // Optional: Add reducers for manual problem updates if needed
    resetProblems(state) {
      state.problems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processSpecificProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processSpecificProblem.fulfilled, (state, action: PayloadAction<IProblem>) => {
        state.loading = false;
        // Add or update the problem in the list (upsert logic)
        const existingIndex = state.problems.findIndex((p) => p.slug === action.payload.slug);
        if (existingIndex !== -1) {
          state.problems[existingIndex] = action.payload; // Update existing problem
        } else {
          state.problems.push(action.payload); // Add new problem
        }
      })
      .addCase(processSpecificProblem.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to process problem";
      });
  },
});

export const { resetProblems } = problemSlice.actions;
export default problemSlice.reducer;