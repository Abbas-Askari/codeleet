import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const testCodeAsync = createAsyncThunk(
  "editor/testCodeAsync",
  async (_, { dispatch, getState }) => {
    try {
      console.log("Fetching");
      const { functionName, code, testCases } = getState().newProblem;
      console.log({ functionName, code, testCases });
      try {
        const result = await fetch("http://localhost:3000/problems/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ functionName, code, testCases }),
        });

        const data = await result.json();
        if (result.status !== 200) {
          dispatch(updateError(data.message + " \n " + data.stack));
        } else {
          dispatch(updateError(""));
        }
        dispatch(updateLogs(data.logs));
        dispatch(updateTime(data.time));
        dispatch(updateResults(data.results));
        console.log(data);
      } catch (error) {
        dispatch(updateError(error.message));
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const newProblemSlice = createSlice({
  name: "newProblem",
  initialState: {
    error: "",
    time: 0,
    logs: [],
    results: [],
    code: `function greatestOfThreeNumbers(a, b, c) {
    return a;
}
    `,
    params: ["a", "b", "c"],
    testCases: [
      ["1", "2", "3"],
      ["3", "2", "2"],
      ["3", "1", "2"],
    ],
    functionName: "greatestOfThreeNumbers",
  },
  reducers: {
    updateLogs: (state, action) => {
      state.logs = action.payload;
      console.log({ load: action.payload });
    },
    updateError: (state, action) => {
      console.log("updating error");
      state.error = action.payload;
    },
    updateCode: (state, action) => {
      state.code = action.payload;
    },
    updateTime: (state, action) => {
      state.time = action.payload;
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    updateFunctionName: (state, action) => {
      state.functionName = action.payload;
    },
    addParam: (state) => {
      state.params.push("Parameter: " + state.params.length);
      state.testCases.forEach((testCase) => testCase.push(""));
    },
    setTestCase: (state, action) => {
      const { testCase, index } = action.payload;
      state.testCases[index] = testCase;
    },
    updateParam: (state, action) => {
      const { param, index } = action.payload;
      state.params[index] = param;
    },
    deleteParam: (state, action) => {
      const index = action.payload;
      state.params.splice(index, 1);
      state.testCases.forEach((testCase) => testCase.splice(index, 1));
    },
    deleteTestCase: (state, action) => {
      const index = action.payload;
      console.log("deleting", index);
      state.testCases.splice(index, 1);
    },
    addTestCase: (state) => {
      state.testCases.push(Array(state.params.length).fill(""));
    },
  },
});

export const {
  updateFunctionName,
  updateCode,
  updateError,
  updateResults,
  updateLogs,
  updateFailed,
  updateTime,
  addParam,
  setTestCase,
  updateParam,
  deleteParam,
  deleteTestCase,
  addTestCase,
} = newProblemSlice.actions;
export default newProblemSlice.reducer;
