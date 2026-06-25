import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllBooks = createAsyncThunk( 
    'allbooks/getAllBooks',
    async (_, { rejectWithValue, getState}) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await axios.get(`${API_URL}/api/allbooks/getallbooks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch AllBooks.';
            return rejectWithValue(errorMessage);
        }
    }

)

const allbookSlice = createSlice({
    name: 'allbooks',
    initialState: {
        allusers: [],
        status: 'idle',
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getAllBooks.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllBooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allbooks = Array.isArray(action.payload.books)
                    ? action.payload.books
                    : [];
            })
            .addCase(getAllBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
});

export default allbookSlice.reducer;