import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../database/firebase';
import { signOut } from 'firebase/auth';

export const userSlice = createSlice({
    name : "user",
    initialState : {
        user : null,
    },
    reducers : {
        userLogin : (state, action) => {
            state.user = action.payload
            sessionStorage.setItem('user', JSON.stringify(action.payload))
        },
        userLogout: (state, action) => {
            state.user = null;
        }
    }
})

export const logout = () => (dispatch) => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            sessionStorage.removeItem('user');
            dispatch(userLogout())
        })
        .catch((error) => {
            // An error happened.
            console.log(error);
            alert('error');
        });
}

export const { userLogin, userLogout } = userSlice.actions
export default userSlice.reducer
