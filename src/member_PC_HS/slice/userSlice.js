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
        /** PCH */
        userLogout: (state, action) => {
            state.user = null;
        }
        // 새로 입력한 창
        ,
        userDate: (state, action) => {
            state.user.user = action.payload
        }
    }
})

/** PCH */
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

// userDate넣어줌
export const { userLogin, userLogout, userDate } = userSlice.actions
export default userSlice.reducer
