import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import alluserReducer from './slices/alluserSlice';
import allbookReducer from './slices/allbookSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        alluser: alluserReducer,
        allbook: allbookReducer,
    },
});

