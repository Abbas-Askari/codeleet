import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "./editorSlice";
import newProblemSlice from "./new-problem/new-problem-slice";

export default configureStore({
  reducer: {
    editor: editorSlice,
    newProblem: newProblemSlice,
  },
});
