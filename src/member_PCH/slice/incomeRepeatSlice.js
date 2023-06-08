import { createSlice } from '@reduxjs/toolkit'


// 반복수입 리덕스
export const incomeRepeatSlice = createSlice({
  name : "incomeRe",
  initialState: [],
  reducers : {
    addIncomeRepeat : (state, action) => {
      const newIncomeRepeat = action.payload;
      state.push(newIncomeRepeat);
    }
  }
})


export const { addIncomeRepeat } = incomeRepeatSlice.actions;
export default incomeRepeatSlice.reducer; 