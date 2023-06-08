import { configureStore } from '@reduxjs/toolkit';
import userSlice from './member_PC_HS/slice/userSlice';

export default configureStore({
  reducer : {
    user : userSlice
  }
})