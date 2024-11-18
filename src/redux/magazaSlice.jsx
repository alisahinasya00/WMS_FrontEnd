import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5002/api/Magaza';

// Initial state
const initialState = {
    magazalar: [],
    selectedMagaza: null,  // Seçilen mağaza
    loading: false,
    error: null,
};

// Async actions (CRUD işlemleri)
export const fetchMagazalar = createAsyncThunk('magaza/fetchMagazalar', async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
});

export const addMagaza = createAsyncThunk('magaza/addMagaza', async (magaza) => {
    const response = await axios.post(API_URL, magaza);
    return response.data;
});

export const updateMagaza = createAsyncThunk('magaza/updateMagaza', async (magaza) => {
    const response = await axios.put(`${API_URL}/${magaza.id}`, magaza);
    return response.data;
});

export const deleteMagaza = createAsyncThunk('magaza/deleteMagaza', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

// Reducer to set selected magaza
export const setSelectedMagaza = createAsyncThunk('magaza/setSelectedMagaza', async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
});

// Slice
const magazaSlice = createSlice({
    name: 'magaza',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMagazalar.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMagazalar.fulfilled, (state, action) => {
                state.loading = false;
                state.magazalar = action.payload;
            })
            .addCase(fetchMagazalar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addMagaza.pending, (state) => {
                state.loading = true;
            })
            .addCase(addMagaza.fulfilled, (state, action) => {
                state.loading = false;
                state.magazalar.push(action.payload);
            })
            .addCase(addMagaza.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateMagaza.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMagaza.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.magazalar.findIndex((magaza) => magaza.id === action.payload.id);
                if (index !== -1) {
                    state.magazalar[index] = action.payload;
                }
            })
            .addCase(updateMagaza.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteMagaza.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMagaza.fulfilled, (state, action) => {
                state.loading = false;
                state.magazalar = state.magazalar.filter((magaza) => magaza.id !== action.payload);
            })
            .addCase(deleteMagaza.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(setSelectedMagaza.fulfilled, (state, action) => {
                state.selectedMagaza = action.payload;
            });
    },
});

export default magazaSlice.reducer;
