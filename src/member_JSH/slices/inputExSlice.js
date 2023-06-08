import { createSlice } from "@reduxjs/toolkit";

// 지출 데이터 리덕스
export const inputExSlice = createSlice({
    name : "inputEx",
    initialState : [],
    reducers : {
        addEx : (state, action) => {
            const newEx = action.payload;
            state.push(newEx);
        }
    }
})

export const {addEx} = inputExSlice.actions
export default inputExSlice.reducer