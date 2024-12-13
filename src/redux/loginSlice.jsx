/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const initialState = {
    seciliadmin: null,
    magazalar: [],
    seciliMagaza: null,
    seciliCalisan: null,
    calisanlar: [],
    status: 'idle',
    error: null,
}

export const getCalisan = createAsyncThunk('getCalisan', async () => {
    try {
        const response = await axios.get("http://localhost:5002/api/Calisan");
        return response.data.data;
    } catch (error) {
        console.error("API Hatası: ", error);
        throw error; // Hata durumunu fırlat
    }
});


export const getMagaza = createAsyncThunk('getMagaza', async () => {
    const response = await axios.get("http://localhost:5002/api/Magaza");
    return response.data.data;
})

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCalisan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCalisan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calisanlar = action.payload;
            })
            .addCase(getCalisan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getMagaza.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMagaza.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.magazalar = action.payload;
            })
            .addCase(getMagaza.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})
export default loginSlice.reducer