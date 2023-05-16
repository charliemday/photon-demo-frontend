import { createSlice } from '@reduxjs/toolkit';
import { authApi } from 'api';
import { User } from 'types';

export interface AuthState {
    token: string | null;
    userDetails: User | null;
}

const initialState: AuthState = {
    token: null,
    userDetails: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken(state, action) {
            state.token = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
            state.token = action.payload.token;
        }),
            builder.addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
                state.token = action.payload.token;
            }),
            builder.addMatcher(authApi.endpoints.setPassword.matchFulfilled, (state, action) => {
                state.token = action.payload.token;
            })
    }
})

// Action creators are generated for each case reducer function
export const {
    setAuthToken
} = authSlice.actions

export default authSlice.reducer