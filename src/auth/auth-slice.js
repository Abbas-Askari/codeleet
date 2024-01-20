import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (user, { dispatch }) => {
    try {
      console.log({ user });
      dispatch(updateIsLoading(true));
      const result = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await result.json();
      if (result.status !== 200) {
        dispatch(updateError(data.message));
      } else {
        dispatch(updateError(""));
        dispatch(login(data));
      }
    } catch (error) {
      dispatch(updateError(error.message));
      console.log(error);
    } finally {
      dispatch(updateIsLoading(false));
    }
  }
);

export const signupAsync = createAsyncThunk(
  "auth/signupAsync",
  async (user, { dispatch }) => {
    try {
      dispatch(updateIsLoading(true));
      const result = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await result.json();
      if (result.status !== 200) {
        dispatch(updateError(data.message));
      } else {
        dispatch(updateError(""));
        dispatch(login(data));
      }
    } catch (error) {
      dispatch(updateError(error.message));
      console.log(error.message);
    } finally {
      dispatch(updateIsLoading(false));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isLoading: false,
    error: "",
    token: localStorage.getItem("token") || "",
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = state.token || action.payload.token;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    updateError: (state, action) => {
      state.error = action.payload;
    },
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, updateError, updateIsLoading } =
  authSlice.actions;

export default authSlice.reducer;
