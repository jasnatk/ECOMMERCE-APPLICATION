import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: {},
    isUserAuth: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.isUserAuth = true;
            state.userData = action.payload;
        },
        clearUser: (state) => {
            state.isUserAuth = false;
            state.userData = {};
        },
    },
});

// Action creators are generated for each case reducer function
export const { saveUser, clearUser } = userSlice.actions;

export default userSlice.reducer;