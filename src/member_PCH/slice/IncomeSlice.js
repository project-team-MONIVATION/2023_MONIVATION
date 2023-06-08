import { createSlice } from '@reduxjs/toolkit'

export const IncomeSlice = createSlice({
  name : "income",
  initialState: {
    uid : null,
    date : null,
    price : null,
    category : null,
    memo : null
  },
  reducers : {
    addIncome : (state, action) => {}
  }
})