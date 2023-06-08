import { createSlice } from "@reduxjs/toolkit";

// 저금 데이터 리덕스
export const inputSavingSlice = createSlice({
    name : "inputSaving",
    initialState : [],
    reducers : {
        addSaving : (state, action) => {
            const newSaving = action.payload;
            state.push(newSaving);
        }
    }
})

export const {addSaving} = inputSavingSlice.actions
export default inputSavingSlice.reducer