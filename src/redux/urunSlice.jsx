import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URLs
const URUN_API_URL = 'http://localhost:5002/api/Urun';
const KONUM_API_URL = 'http://localhost:5002/api/Konum';

// Async Thunks for API calls
// Ürün
export const fetchUrunler = createAsyncThunk('urun/fetchUrunler', async () => {
    const response = await axios.get(URUN_API_URL);
    return response.data.data;
});

export const addUrun = createAsyncThunk('urun/addUrun', async (newUrun) => {
    const response = await axios.post(URUN_API_URL, newUrun);
    return response.data;
});

export const deleteUrun = createAsyncThunk('urun/deleteUrun', async (urunId) => {
    await axios.delete(`${URUN_API_URL}/${urunId}`);
    return urunId;
});

export const updateUrun = createAsyncThunk('urun/updateUrun', async ({ updatedData }) => {
    const response = await axios.put(URUN_API_URL, updatedData);
    return response.data;
});

// Konum
export const fetchKonumlar = createAsyncThunk('urun/fetchKonumlar', async () => {
    const response = await axios.get(KONUM_API_URL);
    return response.data.data;
});


export const addKonum = createAsyncThunk('urun/addKonum', async (newKonum) => {
    const response = await axios.post(KONUM_API_URL, newKonum);
    return response.data;
});

export const deleteKonum = createAsyncThunk('urun/deleteKonum', async (konumId) => {
    await axios.delete(`${KONUM_API_URL}/${konumId}`);
    return konumId;
});

export const updateKonum = createAsyncThunk('urun/updateKonum', async ({ updatedData }) => {
    const response = await axios.put(KONUM_API_URL, updatedData);
    return response.data;
});

// Create Slice
const urunSlice = createSlice({
    name: 'urun',
    initialState: {
        urunler: [],
        konumlar: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Ürün CRUD
        builder
            .addCase(fetchUrunler.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUrunler.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.urunler = action.payload;
            })
            .addCase(fetchUrunler.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addUrun.fulfilled, (state, action) => {
                state.urunler.push(action.payload);
            })
            .addCase(deleteUrun.fulfilled, (state, action) => {
                state.urunler = state.urunler.filter((urun) => urun.urunId !== action.payload);
            })
            .addCase(updateUrun.fulfilled, (state, action) => {
                const index = state.urunler.findIndex((urun) => urun.urunId === action.payload.urunId);
                if (index >= 0) {
                    state.urunler[index] = { ...state.urunler[index], ...action.payload };
                }
            });

        // Konum CRUD
        builder
            .addCase(fetchKonumlar.fulfilled, (state, action) => {
                state.konumlar = action.payload;
            })
            .addCase(addKonum.fulfilled, (state, action) => {
                state.konumlar.push(action.payload);
            })
            .addCase(deleteKonum.fulfilled, (state, action) => {
                state.konumlar = state.konumlar.filter((konum) => konum.konumId !== action.payload);
            })
            .addCase(updateKonum.fulfilled, (state, action) => {
                const index = state.konumlar.findIndex((konum) => konum.konumId === action.payload.konumId);
                if (index >= 0) {
                    state.konumlar[index] = { ...state.konumlar[index], ...action.payload };
                }
            });
    },
});

export default urunSlice.reducer;
