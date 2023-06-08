import { createSlice } from "@reduxjs/toolkit";

// 수입 데이터 리덕스
export const inputImpSlice = createSlice({
    name : "inputImp",
    initialState : [
    ],
    reducers : {
        addImp : (state, action) => {
            const newImp = action.payload;
            state.push(newImp);
        }
    }
})

export const {addImp} = inputImpSlice.actions
export default inputImpSlice.reducer