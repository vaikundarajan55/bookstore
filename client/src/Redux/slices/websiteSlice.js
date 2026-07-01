import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllBooksData = createAsyncThunk( 
    'allwebsite/getAllBooksData',
    async (_, { rejectWithValue, getState}) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await axios.get(`${API_URL}/api/allwebsite/getshopbooks`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch AllBooks.';
            return rejectWithValue(errorMessage);
        }
    }
)

const websiteSlice = createSlice({
    name: 'allwebsite',
    initialState: {
        allwebsite: [],
        status: 'idle',
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getAllBooksData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllBooksData.fulfilled, (state, action) => {
                console.log("Reducer got payload:", action.payload);
   
                state.status = "succeeded";
                state.allwebsite = Array.isArray(action.payload.shopbook)
                    ? action.payload.shopbook
                    : [];
            })
            .addCase(getAllBooksData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
           
    }
});

export default websiteSlice.reducer;