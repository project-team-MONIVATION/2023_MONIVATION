import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name : "user",
    initialState : {
        user : null,
    },
    reducers : {
        userLogin : (state, action) => {
            state.user = action.payload

            sessionStorage.setItem('user',JSON.stringify(action.payload))
        }
    }
})

export const { userLogin } = userSlice.actions
export default userSlice.reducer