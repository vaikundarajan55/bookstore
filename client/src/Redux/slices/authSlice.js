import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// --- Configuration ---
const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : 'http://localhost:5000/api/auth';


// --- Thunks for API Calls ---
export const LoginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {

            const response = await axios.post(`${API_URL}/login`, credentials);

            // ✅ Persist both token and user
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            return rejectWithValue(errorMessage);
        }
    }
);

// --- LOGOUT THUNK ---
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return true;
    }
);

// --- Initial State and Token Hydration Logic ---
let token = localStorage.getItem('token');
let user = null;

if (token) {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            console.warn('Token expired. Clearing session.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            token = null;
        } else {
            // ✅ Hydrate user either from storage or fallback to decoded token
            const storedUser = localStorage.getItem('user');
            user = storedUser
                ? JSON.parse(storedUser)
                : {
                    emp_id: decodedToken.id,
                    emp_email: decodedToken.email,
                    emp_name: decodedToken.name,
                    emp_role: decodedToken.role,
                };
        }
    } catch (error) {
        console.error('Invalid token found in localStorage. Clearing.', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token = null;
        user = null;
    }
}

const initialState = {
    token: token,
    user: user,
    status: 'idle',
    error: null,
    isAuthenticated: !!token,
};

// --- Redux Slice ---
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
                state.isAuthenticated = true;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                state.error = action.payload;
            })
            // LOGOUT (important fix)
            .addCase(logoutUser.fulfilled, (state) => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                state.token = null;
                state.user = null;
                state.status = 'idle';
                state.error = null;
                state.isAuthenticated = false; // <-- Key fix for UI redirect
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;