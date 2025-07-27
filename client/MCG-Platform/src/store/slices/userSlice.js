import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    user: null,
    email: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id;
            state.user = action.payload.name;
            state.email = action.payload.email;
        },
        logout: (state) => {
            state.id = null;
            state.user = null;
            state.email = null;
        },
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;