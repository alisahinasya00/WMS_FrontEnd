import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5002/api/Calisan';

// Async Thunks for API calls
export const fetchCalisanlar = createAsyncThunk('calisan/fetchCalisanlar', async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
});

export const addCalisan = createAsyncThunk('calisan/addCalisan', async (newCalisan) => {
    const response = await axios.post(API_URL, newCalisan);
    return response.data;
});

export const deleteCalisan = createAsyncThunk('calisan/deleteCalisan', async (calisanId) => {
    await axios.delete(`${API_URL}/${calisanId}`);
    return calisanId;
});

export const updateCalisan = createAsyncThunk('calisan/updateCalisan', async ({ updatedData }) => {
    const response = await axios.put(API_URL, updatedData);
    return response.data;
});

// Create Slice
const calisanSlice = createSlice({
    name: 'calisan',
    initialState: {
        calisanlar: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalisanlar.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCalisanlar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calisanlar = action.payload;
            })
            .addCase(fetchCalisanlar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addCalisan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCalisan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calisanlar.push(action.payload);
            })
            .addCase(addCalisan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteCalisan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCalisan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calisanlar = state.calisanlar.filter(calisan => calisan.calisanId !== action.payload);
            })
            .addCase(deleteCalisan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateCalisan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCalisan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.calisanlar.findIndex(calisan => calisan.calisanId === action.payload.calisanId);
                if (index >= 0) {
                    state.calisanlar[index] = { ...state.calisanlar[index], ...action.payload }; // Eski veriyi immütabil şekilde güncelle
                }
            })
            .addCase(updateCalisan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default calisanSlice.reducer;
