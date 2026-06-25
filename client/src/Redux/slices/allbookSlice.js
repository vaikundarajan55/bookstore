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

export const addNewBook = createAsyncThunk(
    'allbooks/addNewBook',
    async (newBook, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/allbooks/addnewbook`, newBook, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add Book.';
            return rejectWithValue(errorMessage);
        }
    }
)
export const editUpdateBook = createAsyncThunk(
    'allbooks/editUpdateBook',
    async (UpdateData, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/allbooks/editnewebook`, UpdateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to User.';
            return rejectWithValue(errorMessage);
        }
    }
)
export const deleteBook = createAsyncThunk(
    "allbooks/deleteBook",
    async (bookId, { rejectWithValue , getState}) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/allbooks/deletebook/${bookId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { bookId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


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
            .addCase(addNewBook.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addNewBook.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                const allbooks = action.payload?.newAddBook;
                if (allbooks) {
                    state.allbooks.unshift(allbooks);
                }
            })
            .addCase(addNewBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editUpdateBook.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(editUpdateBook.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload?.userEditData;
                if (!updated) return;
                // Update current User details
                if (state.allbooks.books?.book_id === updated.book_id) {
                    state.allbooks.books = { ...state.allbooks.books, ...updated };
                }
            })
            .addCase(editUpdateBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.loading  = false;
                // ✅ Remove deleted user from Redux state
                state.allbooks = state.allbooks.filter(
                    u => String(u.id) !== String(action.payload.bookId)
                );
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
            });
    }
});

export default allbookSlice.reducer;