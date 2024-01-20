import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const testCodeAsync = createAsyncThunk(
  "editor/testCodeAsync",
  async (_, { dispatch, getState }) => {
    try {
      const { functionName, code, testCases } = getState().newProblem;
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
      } catch (error) {
        dispatch(updateError(error.message));
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const submitProblemAsync = createAsyncThunk(
  "editor/testCodeAsync",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState().newProblem;
      const contributor = getState().auth.user._id;
      console.log({ contributor });
      const problem = {
        title: state.title,
        description: state.description,
        functionName: state.functionName,
        solutionFunction: state.code,
        inputs: JSON.stringify(
          state.testCases.map((testCase) =>
            testCase.map((arg) => JSON.parse(arg))
          )
        ),
        template: `function ${state.functionName}(${state.params.join(", ")}) {
          // Your code here 
        }`,
        contributor: contributor,
        params: state.params,
      };
      const result = await fetch("http://localhost:3000/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problem),
      });

      const data = await result.json();
      if (result.status !== 200) {
        dispatch(updateError(data.message + " \n " + data.stack));
      } else {
        dispatch(updateError(""));
      }
    } catch (error) {
      dispatch(updateError(error.message));
      console.error(error);
    }
  }
);

export const newProblemSlice = createSlice({
  name: "newProblem",
  initialState: {
    title: "Greater of Three Numbers",
    description:
      "Write a function that takes three numbers as input and returns the greatest of the three numbers",
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
    updateTitle: (state, action) => {
      state.title = action.payload;
    },
    updateDescription: (state, action) => {
      state.description = action.payload;
    },
    updateLogs: (state, action) => {
      state.logs = action.payload;
      console.log({ load: action.payload });
    },
    updateError: (state, action) => {
      if (action.payload !== "") {
        console.log(
          "updating error to: ",
          JSON.parse(JSON.stringify(action.payload))
        );
      }
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
      state.testCases.forEach((testCase) => testCase.push("null"));
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
      state.testCases.splice(index, 1);
    },
    addTestCase: (state) => {
      state.testCases.push(Array(state.params.length).fill(""));
    },
  },
});

export const {
  updateTitle,
  updateDescription,
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
