import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "./editorSlice";
import newProblemSlice from "./new-problem/new-problem-slice";
import authSlice from "./auth/auth-slice";

export default configureStore({
  reducer: {
    editor: editorSlice,
    newProblem: newProblemSlice,
    auth: authSlice,
  },
});
