import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "./editorSlice";


export default configureStore({
    reducer: {
        editor: editorSlice,
    }
});