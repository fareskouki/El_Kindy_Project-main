import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    refreshToken: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setLogout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        
    }
})

export const { setLogin, setLogout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;