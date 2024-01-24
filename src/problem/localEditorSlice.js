import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../../constants";

export const testLocalCasesAsync = createAsyncThunk(
  "localEditor/testLocalCases",
  async (payload, { dispatch, getState }) => {
    dispatch(updateLoading(true));
    try {
      const { code, problem } = payload;
      const testCasesRaw = getState().localEditor.testCases;
      const testCases = testCasesRaw.map((testCase) =>
        testCase.map((arg) => JSON.parse(arg))
      );

      const res = await fetch(BACKEND_URL + "submissions/testProvidedCases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, problem, testCases }),
      });
      const { logs, times, results, errors, expecteds } = await res.json();

      dispatch(updateLogs(logs));
      dispatch(updateExpecteds(expecteds));
      dispatch(updateTimes(times));
      // dispatch(updateTestCases(results));
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
    problem: null,
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
      console.log("Updating test cases to: ", action.payload);
      state.testCases = action.payload;
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    updateLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateTestCase: (state, action) => {
      state.testCases[action.payload.index] = action.payload.result;
      state.results = [];
      state.expecteds = [];
      state.logs = [];
      state.times = [];
    },
    addTestCase: (state) => {
      state.testCases.push(state.testCases[0]);
    },
    updateLocalProblem: (state, action) => {
      console.log("Updating local problem");
      state.problem = action.payload;
      console.log(
        "Updating test cases to: ",
        JSON.parse(action.payload.inputs)
      );
      // individual args must be strings
      state.testCases = JSON.parse(action.payload.inputs).map((testCase) =>
        testCase.map((arg) => JSON.stringify(arg))
      );
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
  updateLoading,
  updateTestCases,
  updateTestCase,
  updateLocalProblem,
  addTestCase,
} = localEditorSlice.actions;
export default localEditorSlice.reducer;
