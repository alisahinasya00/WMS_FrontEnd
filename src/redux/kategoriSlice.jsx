import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5002/api/Kategori';

// Async Thunks for API calls
export const fetchKategoriler = createAsyncThunk('kategori/fetchKategoriler', async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
});

export const addKategori = createAsyncThunk('kategori/addKategori', async (newKategori) => {
    const response = await axios.post(API_URL, newKategori);
    return response.data;
});

export const deleteKategori = createAsyncThunk('kategori/deleteKategori', async (kategoriId) => {
    await axios.delete(`${API_URL}/${kategoriId}`);
    return kategoriId;
});

export const updateKategori = createAsyncThunk('kategori/updateKategori', async ({ updatedData }) => {
    const response = await axios.put(API_URL, updatedData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
});


// Create Slice
const kategoriSlice = createSlice({
    name: 'kategori',
    initialState: {
        kategoriler: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchKategoriler.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchKategoriler.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kategoriler = action.payload;
            })
            .addCase(fetchKategoriler.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addKategori.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addKategori.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kategoriler.push(action.payload);
            })
            .addCase(addKategori.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteKategori.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteKategori.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.kategoriler = state.kategoriler.filter(kategori => kategori.kategoriId !== action.payload);
            })
            .addCase(deleteKategori.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateKategori.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateKategori.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.kategoriler.findIndex(kategori => kategori.kategoriId === action.payload.kategoriId);
                if (index >= 0) {
                    state.kategoriler[index] = { ...state.kategoriler[index], ...action.payload };
                }
            })
            .addCase(updateKategori.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default kategoriSlice.reducer;
