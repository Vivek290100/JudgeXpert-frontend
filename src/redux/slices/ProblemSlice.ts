import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { processSpecificProblem } from "../thunks/ProblemThunks";
import { IProblem, ProblemState } from "../../types/Index";

const initialState: ProblemState = {
  problems: [],
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
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
        const existingIndex = state.problems.findIndex((p) => p.slug === action.payload.slug);
        if (existingIndex !== -1) {
          state.problems[existingIndex] = action.payload;
        } else {
          state.problems.push(action.payload);
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