import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllUsers = createAsyncThunk(
    'allusers/getAllUsers',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await axios.get(`${API_URL}/api/allusers/getallusers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch Users.';
            return rejectWithValue(errorMessage);
        }
    }
);

export const addNewUser = createAsyncThunk(
    'allusers/addNewUser',
    async (newUser, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/allusers/addneweuser`, newUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add video.';
            return rejectWithValue(errorMessage);
        }
    }
)
export const EditNewUser = createAsyncThunk(
    'allusers/EditNewUser',
    async (UpdateData, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/allusers/editneweuser`, UpdateData, {
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
export const deleteUser = createAsyncThunk(
    "alluser/deleteUser",
    async (userId, { rejectWithValue , getState}) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            if (!token) {
                return rejectWithValue('Authentication token is missing.');
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/allusers/deleteuser/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { userId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const alluserSlice = createSlice({
    name: 'allusers',
    initialState: {
        allusers: [],
        status: 'idle',
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allusers = Array.isArray(action.payload.users)
                    ? action.payload.users
                    : [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addNewUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                //state.videos.push(action.payload.videos);
                const allusers = action.payload?.newAddUser;
                if (allusers) {
                    state.allusers.unshift(allusers);
                }
            })
            .addCase(addNewUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(EditNewUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(EditNewUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload?.userEditData;
                if (!updated) return;
                // Update current User details
                if (state.allusers.users?.id === updated.id) {
                    state.allusers.users = { ...state.allusers.users, ...updated };
                }
                console.log(state.allusers.users, "state.allusers.users");
            })
            .addCase(EditNewUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading  = false;
            // ✅ Remove deleted user from Redux state
            state.allusers = state.allusers.filter(
                u => String(u.id) !== String(action.payload.userId)
            );
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error   = action.payload;
        });
            
    }

});

export default alluserSlice.reducer;
