import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: {},
    isUserAuth: false,
    isSellerAuth: false,
    isAdminAuth: false,
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
        saveSeller: (state, action) => {
            state.isSellerAuth = true;
            state.userData = action.payload;
        },
        clearSeller: (state) => {
            state.isSellerAuth = false;
            state.userData = {};
        },
        saveAdmin: (state, action) => {
            state.isAdminAuth = true;
            state.userData = action.payload;
        },
        clearAdmin: (state) => {
            state.isAdminAuth = false;
            state.userData = {};
        },
    },
});

export const {
    saveUser,
    clearUser,
    saveSeller,
    clearSeller,
    saveAdmin,
    clearAdmin
} = userSlice.actions;

export default userSlice.reducer;
