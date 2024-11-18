import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5002/api/Magaza';

// Async actions (CRUD işlemleri)
export const fetchMagazalar = createAsyncThunk('magaza/fetchMagazalar', async () => {
    const response = await axios.get(API_URL);
    console.log('API Yanıtı:', response.data); // Yanıtı kontrol et
    return response.data.data; // Yanıttaki data alanını döndür
});

export const addMagaza = createAsyncThunk('magaza/addMagaza', async (magaza) => {
    const response = await axios.post(API_URL, magaza);
    return response.data; // Yeni mağaza verisini döndür
});

export const updateMagaza = createAsyncThunk('magaza/updateMagaza', async ({ updatedData }) => {
    const response = await axios.put(API_URL, updatedData);
    return response.data;
});

export const deleteMagaza = createAsyncThunk('magaza/deleteMagaza', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id; // Silinen mağazanın ID'sini döndür
});

// Slice
const magazaSlice = createSlice({
    name: 'magaza',
    initialState: {
        magazalar: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMagazalar.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMagazalar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.magazalar = action.payload;
            })
            .addCase(fetchMagazalar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addMagaza.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addMagaza.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.magazalar.push(action.payload);
            })
            .addCase(addMagaza.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteMagaza.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteMagaza.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.magazalar = state.magazalar.filter(magaza => magaza.magazaId !== action.payload);
            })
            .addCase(deleteMagaza.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateMagaza.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateMagaza.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.magazalar.findIndex(magaza => magaza.magazaId === action.payload.magazaId);
                if (index >= 0) {
                    state.magazalar[index] = { ...state.magazalar[index], ...action.payload }; // Eski veriyi immütabil şekilde güncelle
                }
            })
            .addCase(updateMagaza.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default magazaSlice.reducer;
