import { configureStore } from '@reduxjs/toolkit';
import inputImpSlice from './member_JSH/slices/inputImpSlice';
import inputExSlice from './member_JSH/slices/inputExSlice';
import userSlice from './member_PC_HS/slice/userSlice';


export default configureStore({
  reducer : {
    user : userSlice,
    imp : inputImpSlice,
    ex : inputExSlice,
  }
})