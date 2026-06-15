import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import alluserReducer from './slices/alluserSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        alluser: alluserReducer,
    },
});

