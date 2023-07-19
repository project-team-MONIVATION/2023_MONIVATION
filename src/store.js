import { configureStore } from '@reduxjs/toolkit';
import inputImpSlice from './member_JSH/slices/inputImpSlice';
import inputExSlice from './member_JSH/slices/inputExSlice';
import userSlice from './member_PC_HS/slice/userSlice';
import monthSliece from './member_LJC/slices/monthSliece';


export default configureStore({
  reducer : {
    user : userSlice,
    imp : inputImpSlice,
    ex : inputExSlice,
    month : monthSliece,
  }
})

