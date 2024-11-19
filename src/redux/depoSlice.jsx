import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URLs
const BLOK_API_URL = 'http://localhost:5002/api/Blok';
const BOLME_API_URL = 'http://localhost:5002/api/Bolme';
const RAF_API_URL = 'http://localhost:5002/api/Raf';

// Async Thunks for API calls
// Blok
export const fetchBloklar = createAsyncThunk('depo/fetchBloklar', async () => {
    const response = await axios.get(BLOK_API_URL);
    return response.data.data;
});

export const addBlok = createAsyncThunk('depo/addBlok', async (newBlok) => {
    const response = await axios.post(BLOK_API_URL, newBlok);
    return response.data;
});

export const deleteBlok = createAsyncThunk('depo/deleteBlok', async (blokId) => {
    await axios.delete(`${BLOK_API_URL}/${blokId}`);
    return blokId;
});

export const updateBlok = createAsyncThunk('depo/updateBlok', async ({ updatedData }) => {
    const response = await axios.put(BLOK_API_URL, updatedData);
    return response.data;
});

// Bölme
export const fetchBolmeler = createAsyncThunk('depo/fetchBolmeler', async () => {
    const response = await axios.get(BOLME_API_URL);
    return response.data.data;
});

export const addBolme = createAsyncThunk('depo/addBolme', async (newBolme) => {
    const response = await axios.post(BOLME_API_URL, newBolme);
    return response.data;
});

export const deleteBolme = createAsyncThunk('depo/deleteBolme', async (bolmeId) => {
    await axios.delete(`${BOLME_API_URL}/${bolmeId}`);
    return bolmeId;
});

export const updateBolme = createAsyncThunk('depo/updateBolme', async ({ updatedData }) => {
    const response = await axios.put(BOLME_API_URL, updatedData);
    return response.data;
});

// Raf
export const fetchRaflar = createAsyncThunk('depo/fetchRaflar', async () => {
    const response = await axios.get(RAF_API_URL);
    return response.data.data;
});

export const addRaf = createAsyncThunk('depo/addRaf', async (newRaf) => {
    const response = await axios.post(RAF_API_URL, newRaf);
    return response.data;
});

export const deleteRaf = createAsyncThunk('depo/deleteRaf', async (rafId) => {
    await axios.delete(`${RAF_API_URL}/${rafId}`);
    return rafId;
});

export const updateRaf = createAsyncThunk('depo/updateRaf', async ({ rafId, updatedData }) => {
    const response = await axios.put(`${RAF_API_URL}/${rafId}`, updatedData);
    return response.data;
});

// Create Slice
const depoSlice = createSlice({
    name: 'depo',
    initialState: {
        bloklar: [],
        bolmeler: [],
        raflar: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Blok CRUD
        builder
            .addCase(fetchBloklar.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBloklar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bloklar = action.payload;
            })
            .addCase(fetchBloklar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addBlok.fulfilled, (state, action) => {
                state.bloklar.push(action.payload);
            })
            .addCase(deleteBlok.fulfilled, (state, action) => {
                state.bloklar = state.bloklar.filter((blok) => blok.blokId !== action.payload);
            })
            .addCase(updateBlok.fulfilled, (state, action) => {
                const index = state.bloklar.findIndex((blok) => blok.blokId === action.payload.blokId);
                if (index >= 0) {
                    state.bloklar[index] = { ...state.bloklar[index], ...action.payload };
                }
            });

        // Bölme CRUD
        builder
            .addCase(fetchBolmeler.fulfilled, (state, action) => {
                state.bolmeler = action.payload;
            })
            .addCase(addBolme.fulfilled, (state, action) => {
                state.bolmeler.push(action.payload);
            })
            .addCase(deleteBolme.fulfilled, (state, action) => {
                state.bolmeler = state.bolmeler.filter((bolme) => bolme.bolmeId !== action.payload);
            })
            .addCase(updateBolme.fulfilled, (state, action) => {
                const index = state.bolmeler.findIndex((bolme) => bolme.bolmeId === action.payload.bolmeId);
                if (index >= 0) {
                    state.bolmeler[index] = { ...state.bolmeler[index], ...action.payload };
                }
            });

        // Raf CRUD
        builder
            .addCase(fetchRaflar.fulfilled, (state, action) => {
                state.raflar = action.payload;
            })
            .addCase(addRaf.fulfilled, (state, action) => {
                state.raflar.push(action.payload);
            })
            .addCase(deleteRaf.fulfilled, (state, action) => {
                state.raflar = state.raflar.filter((raf) => raf.rafId !== action.payload);
            })
            .addCase(updateRaf.fulfilled, (state, action) => {
                const index = state.raflar.findIndex((raf) => raf.rafId === action.payload.rafId);
                if (index >= 0) {
                    state.raflar[index] = { ...state.raflar[index], ...action.payload };
                }
            });
    },
});

export default depoSlice.reducer;
