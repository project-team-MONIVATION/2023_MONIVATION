import { configureStore } from '@reduxjs/toolkit';
import inputImpSlice from './member_JSH/slices/inputImpSlice';
import inputExSlice from './member_JSH/slices/inputExSlice';
import userSlice from './member_PC_HS/slice/userSlice';
import incomeSlice from './member_PCH/slice/incomeSlice';
import incomeRepeatSlice from './member_PCH/slice/incomeRepeatSlice';
import expenseSlice from './member_PCH/slice/expenseSlice';
import expenseRepeatSlice from './member_PCH/slice/expenseRepeatSlice';


export default configureStore({
  reducer : {
    user : userSlice,
    imp : inputImpSlice,
    ex : inputExSlice,

    income : incomeSlice,
    incomeRe : incomeRepeatSlice,
    expense : expenseSlice,
    expenseRe : expenseRepeatSlice
  }
})

