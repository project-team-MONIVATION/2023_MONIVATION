import { createSlice } from '@reduxjs/toolkit'


// 반복지출 리덕스
export const expenseRepeatSlice = createSlice({
  name : "expenseRe",
  initialState: [],
  reducers : {
    addExpenseRepeat : (state, action) => {
      const newExpenseRepeat = action.payload;
      state.push(newExpenseRepeat);
    }
  }
})


export const { addExpenseRepeat } = expenseRepeatSlice.actions;
export default expenseRepeatSlice.reducer; 