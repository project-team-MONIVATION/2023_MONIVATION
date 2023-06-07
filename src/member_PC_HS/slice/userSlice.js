import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name : "userx",
    initialState : {
        user : null,
    },
    reducers : {
        userLogin : (state, action) => {
            state.user = action.payload
        }
    }
})

export const { userLogin } = userSlice.actions
export default userSlice.reducer