import { configureStore } from '@reduxjs/toolkit';
import inputImpSlice from './member_JSH/slices/inputImpSlice';
import inputExSlice from './member_JSH/slices/inputExSlice';

export default configureStore({
  reducer : {
    imp : inputImpSlice,
    ex : inputExSlice,
  }
})