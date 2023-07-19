import { createSlice } from '@reduxjs/toolkit';

export const monthSliece = createSlice({
    name : "month",
    initialState : {
        month : 0,
    },
    reducers : {
        Month_Calender : (state, action) => {
            state.month = action.payload
        }
    }
})

export const { Month_Calender } = monthSliece.actions
export default monthSliece.reducer