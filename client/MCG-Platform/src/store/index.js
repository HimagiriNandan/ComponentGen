import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sessionsReducer from "./slices/sessionsSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        sessions: sessionsReducer,
    },
});

export default store;