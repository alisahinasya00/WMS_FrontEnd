//http://localhost:5002/api/Calisan
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5002/api/Calisan'; // API endpoint'inizi buraya yazın

// Async Thunks
export const fetchCalisanlar = createAsyncThunk('calisanlar/fetchCalisanlar', async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
});

export const addCalisan = createAsyncThunk('calisanlar/addCalisan', async (calisan) => {
    const response = await axios.post(API_URL, calisan);
    return response.data.data;
});

export const updateCalisan = createAsyncThunk('calisanlar/updateCalisan', async ({ calisanId, calisan }) => {
    const response = await axios.put(`${API_URL}/${calisanId}`, calisan);
    return response.data.data;
});

export const deleteCalisan = createAsyncThunk('calisanlar/deleteCalisan', async (calisanId) => {
    await axios.delete(`${API_URL}/${calisanId}`);
    return calisanId;
});

// Slice
const calisanSlice = createSlice({
    name: "calisan",
    initialState: {
        data: [],
        selectedCalisan: null, // Seçilen çalışanın bilgisi
        status: 'idle',
        error: null,
    },
    reducers: {
        setSelectedCalisan: (state, action) => {
            state.selectedCalisan = action.payload; // Seçilen çalışan atanıyor
        },
        clearSelectedCalisan: (state) => {
            state.selectedCalisan = null; // Seçilen çalışan temizleniyor
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalisanlar.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCalisanlar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchCalisanlar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addCalisan.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(updateCalisan.fulfilled, (state, action) => {
                const index = state.data.findIndex((calisan) => calisan.calisanId === action.payload.calisanId);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteCalisan.fulfilled, (state, action) => {
                state.data = state.data.filter((calisan) => calisan.calisanId !== action.payload);
            });
    },
});

export const { setSelectedCalisan, clearSelectedCalisan } = calisanSlice.actions;

export default calisanSlice.reducer;
