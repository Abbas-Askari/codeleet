import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isValidIdentifier, isValidTestCaseArg } from "../utils";

export function validateTemplate(template, params, functionName) {
  if (typeof template !== "string") return "Template must be a string";
  if (!template.includes(functionName))
    return "Template must contain the function name";

  const tokens = template.split(/[\s\n\r\(\)\{\},]/g);
  console.log({ tokens });
  if (params.some((param) => !tokens.includes(param)))
    return "Template must contain all parameters";
  if (!template.includes("return"))
    return "Template must contain the 'return' keyword";

  try {
    eval(template);
  } catch (error) {
    return error.message;
  }

  return null;
}

function validate(state, dispatch) {
  if (!isValidIdentifier(state.functionName)) {
    dispatch(updateError("Function name must be a valid identifier, See Help"));
    return false;
  }
  if (state.params.length === 0) {
    dispatch(updateError("Function must have at least one parameter"));
    return false;
  }
  if (state.testCases.length < 3) {
    dispatch(updateError("Function must have at least three test case"));
    return false;
  }
  if (
    state.testCases.some((testCase) => testCase.length !== state.params.length)
  ) {
    dispatch(
      updateError("All test cases must have the same number of arguments")
    );
    return false;
  }
  if (state.params.some((param) => !isValidIdentifier(param))) {
    dispatch(updateError("All parameters must be valid identifiers, See Help"));
    return false;
  }
  if (
    state.testCases.some((testCase) =>
      testCase.some((arg) => !isValidTestCaseArg(arg))
    )
  ) {
    dispatch(
      updateError("All test case arguments must be valid JSON, See Help")
    );
    return false;
  }

  console.log("All test cases are valid JSON");
  const templateError = validateTemplate(
    state.template,
    state.params,
    state.functionName
  );
  if (templateError) {
    dispatch(updateError("Invalid template: " + templateError));
    return false;
  }
  return true;
}

export const testCodeAsync = createAsyncThunk(
  "editor/testCodeAsync",
  async (_, { dispatch, getState }) => {
    dispatch(setRunningTestCases(true));
    try {
      const { functionName, code, testCases } = getState().newProblem;
      if (!validate(getState().newProblem, dispatch)) {
        dispatch(setRunningTestCases(false));
        return;
      }
      try {
        const result = await fetch("http://localhost:3000/problems/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            functionName,
            code,
            testCases: testCases.map((testCase) =>
              testCase.map((arg) => JSON.parse(arg))
            ),
          }),
        });

        const data = await result.json();
        if (result.status !== 200) {
          dispatch(updateError(data.message + " \n " + data.stack));
        } else {
          dispatch(updateError(""));
        }
        dispatch(updateLogs(data.logs));
        dispatch(updateTimes(data.times));
        console.log({ times: data.times });
        dispatch(updateResults(data.results));
        dispatch(updateErrors(data.errors));
        console.log({ data });
      } catch (error) {
        dispatch(updateError(error.message));
        console.log(error);
      }
    } catch (error) {
      dispatch(updateError(error.message + " \n " + error.stack));
      console.error(error);
    } finally {
      dispatch(setRunningTestCases(false));
    }
  }
);

export const submitProblemAsync = createAsyncThunk(
  "editor/testCodeAsync",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState().newProblem;
      if (!validate(state, dispatch)) return;
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
        template: state.template,
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
      dispatch(updateError(error.message + " \n " + error.stack));
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
    errors: [],
    times: [],
    results: [],
    template: `
function greatestOfThreeNumbers(a, b, c) {
  return a;
}
`,
    customTemplate: true,
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
    runningTestCases: false,
  },
  reducers: {
    setRunningTestCases: (state, action) => {
      state.runningTestCases = action.payload;
    },
    setCustomTemplate: (state, action) => {
      state.customTemplate = action.payload;
    },
    updateTemplate: (state, action) => {
      console.log("updating template");
      state.template = action.payload;
    },
    updateErrors: (state, action) => {
      state.errors = action.payload;
    },
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
      console.log({ error: action.payload }, "Setting error");
      state.error = action.payload;
    },
    updateCode: (state, action) => {
      state.code = action.payload;
    },
    updateTimes: (state, action) => {
      state.times = action.payload;
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    updateFunctionName: (state, action) => {
      state.functionName = action.payload;
      state.template = `function ${state.functionName}(${state.params.join(
        ", "
      )}) {\n  // Your code here\n  return 0;\n}`;
    },
    addParam: (state) => {
      state.params.push("param_" + (state.params.length + 1));
      state.testCases.forEach((testCase) => testCase.push("null"));
      state.template = `function ${state.functionName}(${state.params.join(
        ", "
      )}) {\n  // Your code here\n  return 0;\n}`;
    },
    setTestCase: (state, action) => {
      const { testCase, index } = action.payload;
      state.testCases[index] = testCase;
    },
    updateParam: (state, action) => {
      const { param, index } = action.payload;
      state.params[index] = param;
      state.template = `function ${state.functionName}(${state.params.join(
        ", "
      )}) {\n  // Your code here\n  return 0;\n}`;
    },
    deleteParam: (state, action) => {
      const index = action.payload;
      state.params.splice(index, 1);
      state.testCases.forEach((testCase) => testCase.splice(index, 1));
      state.template = `function ${state.functionName}(${state.params.join(
        ", "
      )}) {\n  // Your code here\n  return 0;\n}`;
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
  updateErrors,
  updateTitle,
  updateDescription,
  updateFunctionName,
  updateCode,
  updateError,
  updateResults,
  updateLogs,
  updateFailed,
  updateTimes,
  addParam,
  setTestCase,
  updateParam,
  deleteParam,
  deleteTestCase,
  addTestCase,
  updateTemplate,
  setCustomTemplate,
  setRunningTestCases,
} = newProblemSlice.actions;
export default newProblemSlice.reducer;
