import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../constants";

export const submitCodeAsync = createAsyncThunk(
  "editor/submitCodeAsync",
  async (payload, { dispatch, getState }) => {
    console.log({ payload });
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${BACKEND_URL}submissions/${payload.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },

        body: JSON.stringify({ code: payload.code }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        if (data.message === "Forbidden") {
          dispatch(updateError("Please login to submit code"));
        } else {
          dispatch(updateError(data.message + " \n " + data.stack));
        }
      } else {
        dispatch(updateError(""));
      }
      dispatch(updateTime(data.time));
      dispatch(updateLogs(data.logs));
      console.log({ data });
      dispatch(updateFailed(data.failed));
      dispatch(updateLogs(data.logs));
    } catch (error) {
      console.log({ error });
      dispatch(updateError(error.message));
    } finally {
      dispatch(setLoading(false));
    }

    return data;
  }
);

export const deleteProblemAsync = createAsyncThunk(
  "editor/deleteProblem",
  async (payload, { dispatch, getState }) => {
    try {
      const response = await fetch(BACKEND_URL + `${payload.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        dispatch(updateError(data.message + " \n " + data.stack));
      } else {
        dispatch(updateError(""));
      }
    } catch (error) {
      console.log({ error });
      dispatch(updateError(error.message));
    }
  }
);

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    error: "",
    failed: null,
    time: -1,
    logs: [],
    result: null,
    code: "Hello, this is code by Abbas",
    problem: null,
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateLogs: (state, action) => {
      state.logs = action.payload;
      console.log({ load: action.payload });
    },
    updateProblem: (state, action) => {
      state.problem = action.payload;
    },
    updateError: (state, action) => {
      state.error = action.payload;
    },
    updateCode: (state, action) => {
      state.code = action.payload.code;
      console.log(action.payload);
      localStorage.setItem(
        `code-${action.payload.problemId}`,
        action.payload.code
      );
    },
    updateTime: (state, action) => {
      state.time = action.payload;
    },
    updateFailed: (state, action) => {
      state.failed = action.payload;
    },
  },
});

export const {
  setLoading,
  updateProblem,
  updateCode,
  increment,
  decrement,
  incrementByAmount,
  updateError,
  updateLogs,
  updateFailed,
  updateTime,
} = editorSlice.actions;
export default editorSlice.reducer;
