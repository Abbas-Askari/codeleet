import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const submitCodeAsync = createAsyncThunk('editor/submitCodeAsync', async (code, {dispatch, getState}) => {
    try {
        const response = await fetch('http://localhost:3000/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        if (response.status !== 200) {
            dispatch(updateError(data.message + " \n " + data.stack));
        } else {
            dispatch(updateError(""));
        }
        dispatch(updateTime(data.time));
        dispatch(updateLogs(data.logs));
        dispatch(updateFailed(data.failed));
        dispatch(updateLogs(data.logs));
    } catch (error) {
        console.log({error})
        dispatch(updateError(error.message));
    }


    return data;
});

export const editorSlice = createSlice({
    name: 'editor',
    initialState: {
        error: "",
        failed: null,
        time: 0,
        logs: [],
        result: null,
        code: "Hello, this is code by Abbas",
    },
    reducers: {
        updateLogs: (state, action) => {
            state.logs = action.payload;
            console.log({load: action.payload})
        },
        updateError: (state, action) => {
            state.error = action.payload;
        },
        updateCode: (state, action) => {
            state.code = action.payload;
        },
        updateTime: (state, action) => {
            state.time = action.payload;
        },
        updateFailed: (state, action) => {
            if (!action.payload) return
            if (Object.keys(action.payload).length === 0) {
                state.failed = null;
            } else {
                state.failed = action.payload;
            }
        }
    },
});

export const { updateCode, increment, decrement, incrementByAmount, updateError, updateLogs, updateFailed, updateTime } = editorSlice.actions;
export default editorSlice.reducer;