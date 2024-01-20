import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const testLocalCasesAsync = createAsyncThunk(
  "localEditor/testLocalCases",
  async (payload, { dispatch, getState }) => {
    dispatch(updateLoading(true));
    try {
      const { code, problem } = payload;
      const testCases = JSON.parse(problem.inputs);

      const res = await fetch(
        "http://localhost:3000/submissions/testProvidedCases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, problem, testCases }),
        }
      );
      const { logs, times, results, errors, expecteds } = await res.json();

      dispatch(updateLogs(logs));
      dispatch(updateExpecteds(expecteds));
      dispatch(updateTimes(times));
      dispatch(updateTestCases(results));
      dispatch(updateErrors(errors));
      dispatch(updateResults(results));

      console.log({ logs, times, results, expecteds, errors });
    } catch (error) {
      console.log(error.message + " \n " + error.stack);
      dispatch(updateMajorError(error.message + " \n " + error.stack));
    } finally {
      dispatch(updateLoading(false));
    }
  }
);

export const localEditorSlice = createSlice({
  name: "localEditor",
  initialState: {
    majorError: "",
    errors: [],
    expecteds: [],
    times: 0,
    logs: [],
    results: [],
    loading: false,
    testCases: [],
  },
  reducers: {
    resetLocalEditorSlice: (state) => {
      state.majorError = "";
      state.errors = [];
      state.expecteds = [];
      state.times = 0;
      state.logs = [];
      state.results = [];
      state.loading = false;
      state.testCases = [];
    },
    updateMajorError: (state, action) => {
      state.majorError = action.payload;
    },
    updateLogs: (state, action) => {
      state.logs = action.payload;
      console.log({ load: action.payload });
    },
    updateErrors: (state, action) => {
      state.errors = action.payload;
    },
    updateTimes: (state, action) => {
      state.times = action.payload;
    },
    updateExpecteds: (state, action) => {
      state.expecteds = action.payload;
    },
    updateTestCases: (state, action) => {
      state.testCases = action.payload;
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    updateLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  resetLocalEditorSlice,
  updateResults,
  updateMajorError,
  updateErrors,
  updateLogs,
  updateExpecteds,
  updateTimes,
  updateTestCases,
  updateLoading,
} = localEditorSlice.actions;
export default localEditorSlice.reducer;
