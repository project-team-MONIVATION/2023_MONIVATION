import { createSlice } from '@reduxjs/toolkit'


// 일반지출 리덕스
export const expenseSlice = createSlice({
  name : "expense",
  initialState: [],
  reducers : {
    addExpense : (state, action) => {
      const newExpense = action.payload;
      state.push(newExpense);
    }
  }
})


export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer; 