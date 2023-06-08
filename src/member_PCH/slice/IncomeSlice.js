import { createSlice } from '@reduxjs/toolkit'


// 일반수입 리덕스
export const incomeSlice = createSlice({
  name : "income",
  initialState: [],
  reducers : {
    addIncome : (state, action) => {
      const newIncome = action.payload;
      state.push(newIncome);
    }
  }
})


export const { addIncome } = incomeSlice.actions;
export default incomeSlice.reducer; 