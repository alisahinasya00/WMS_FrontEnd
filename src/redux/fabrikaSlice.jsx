import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5002/api/Fabrika';  // API URL'nizi burada belirtin

// Async Thunks for API calls
export const fetchFabrikalar = createAsyncThunk('fabrika/fetchFabrikalar', async () => {
    const response = await axios.get(API_URL);
    return response.data.data;  // Veriyi geri döndür
});

export const addFabrika = createAsyncThunk('fabrika/addFabrika', async (newFabrika) => {
    const response = await axios.post(API_URL, newFabrika);
    return response.data;
});

export const deleteFabrika = createAsyncThunk('fabrika/deleteFabrika', async (fabrikaId) => {
    await axios.delete(`${API_URL}/${fabrikaId}`);
    return fabrikaId;
});

export const updateFabrika = createAsyncThunk('fabrika/updateFabrika', async ({ updatedData }) => {
    const response = await axios.put(API_URL, updatedData);
    return response.data;
});

// Create Slice
const fabrikaSlice = createSlice({
    name: 'fabrika',
    initialState: {
        fabrikalar: [],
        status: 'idle',  // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFabrikalar.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFabrikalar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fabrikalar = action.payload;
            })
            .addCase(fetchFabrikalar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addFabrika.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addFabrika.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fabrikalar.push(action.payload);
            })
            .addCase(addFabrika.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteFabrika.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteFabrika.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fabrikalar = state.fabrikalar.filter(fabrika => fabrika.fabrikaId !== action.payload);
            })
            .addCase(deleteFabrika.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateFabrika.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateFabrika.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.fabrikalar.findIndex(fabrika => fabrika.fabrikaId === action.payload.fabrikaId);
                if (index >= 0) {
                    state.fabrikalar[index] = { ...state.fabrikalar[index], ...action.payload }; // Eski veriyi immütabil şekilde güncelle
                }
            })
            .addCase(updateFabrika.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default fabrikaSlice.reducer;
