import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API URL'leri
const ISLEM_API_URL = 'http://localhost:5002/api/Islem';
const GIRIS_ISLEM_API_URL = 'http://localhost:5002/api/GirisIslem';
const CIKIS_ISLEM_API_URL = 'http://localhost:5002/api/CikisIslem';
const IADE_ISLEM_API_URL = 'http://localhost:5002/api/IadeIslem';
const ISLEM_TUR_API_URL = 'http://localhost:5002/api/IslemTur';

// Async Thunks - API çağrıları

// Islem
export const fetchIslemler = createAsyncThunk('siparis/fetchIslemler', async () => {
    const response = await axios.get(ISLEM_API_URL);
    return response.data.data;
});

export const addIslem = createAsyncThunk('siparis/addIslem', async (newIslem) => {
    const response = await axios.post(ISLEM_API_URL, newIslem);
    return response.data;
});

export const deleteIslem = createAsyncThunk('siparis/deleteIslem', async (islemId) => {
    await axios.delete(`${ISLEM_API_URL}/${islemId}`);
    return islemId;
});

export const updateIslem = createAsyncThunk('siparis/updateIslem', async ({updatedData }) => {
    const response = await axios.put(ISLEM_API_URL, updatedData);
    return response.data;
});

// GirisIslem
export const fetchGirisIslemler = createAsyncThunk('siparis/fetchGirisIslemler', async () => {
    const response = await axios.get(GIRIS_ISLEM_API_URL);
    return response.data.data;
});

export const addGirisIslem = createAsyncThunk('siparis/addGirisIslem', async (newGirisIslem) => {
    const response = await axios.post(GIRIS_ISLEM_API_URL, newGirisIslem);
    return response.data;
});

export const deleteGirisIslem = createAsyncThunk('siparis/deleteGirisIslem', async (girisIslemId) => {
    await axios.delete(`${GIRIS_ISLEM_API_URL}/${girisIslemId}`);
    return girisIslemId;
});

export const updateGirisIslem = createAsyncThunk('siparis/updateGirisIslem', async ({ updatedData }) => {
    const response = await axios.put(GIRIS_ISLEM_API_URL, updatedData);
    return response.data;
});

// CikisIslem
export const fetchCikisIslemler = createAsyncThunk('siparis/fetchCikisIslemler', async () => {
    const response = await axios.get(CIKIS_ISLEM_API_URL);
    return response.data.data;
});

export const addCikisIslem = createAsyncThunk('siparis/addCikisIslem', async (newCikisIslem) => {
    const response = await axios.post(CIKIS_ISLEM_API_URL, newCikisIslem);
    return response.data;
});

export const deleteCikisIslem = createAsyncThunk('siparis/deleteCikisIslem', async (cikisIslemId) => {
    await axios.delete(`${CIKIS_ISLEM_API_URL}/${cikisIslemId}`);
    return cikisIslemId;
});

export const updateCikisIslem = createAsyncThunk('siparis/updateCikisIslem', async ({updatedData }) => {
    const response = await axios.put(CIKIS_ISLEM_API_URL, updatedData);
    return response.data;
});

// IadeIslem
export const fetchIadeIslemler = createAsyncThunk('siparis/fetchIadeIslemler', async () => {
    const response = await axios.get(IADE_ISLEM_API_URL);
    return response.data.data;
});

export const addIadeIslem = createAsyncThunk('siparis/addIadeIslem', async (newIadeIslem) => {
    const response = await axios.post(IADE_ISLEM_API_URL, newIadeIslem);
    return response.data;
});

export const deleteIadeIslem = createAsyncThunk('siparis/deleteIadeIslem', async (iadeIslemId) => {
    await axios.delete(`${IADE_ISLEM_API_URL}/${iadeIslemId}`);
    return iadeIslemId;
});

export const updateIadeIslem = createAsyncThunk('siparis/updateIadeIslem', async ({ updatedData }) => {
    const response = await axios.put(IADE_ISLEM_API_URL, updatedData);
    return response.data;
});

// IslemTur
export const fetchIslemTurler = createAsyncThunk('siparis/fetchIslemTurler', async () => {
    const response = await axios.get(ISLEM_TUR_API_URL);
    return response.data.data;
});

export const addIslemTur = createAsyncThunk('siparis/addIslemTur', async (newIslemTur) => {
    const response = await axios.post(ISLEM_TUR_API_URL, newIslemTur);
    return response.data;
});

export const deleteIslemTur = createAsyncThunk('siparis/deleteIslemTur', async (islemTurId) => {
    await axios.delete(`${ISLEM_TUR_API_URL}/${islemTurId}`);
    return islemTurId;
});

export const updateIslemTur = createAsyncThunk('siparis/updateIslemTur', async ({updatedData }) => {
    const response = await axios.put(ISLEM_TUR_API_URL, updatedData);
    return response.data;
});

// Slice
const siparisSlice = createSlice({
    name: 'siparis',
    initialState: {
        islemler: [],
        girisIslemler: [],
        cikisIslemler: [],
        iadeIslemler: [],
        islemTurler: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Islem CRUD işlemleri
        builder
            .addCase(fetchIslemler.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchIslemler.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.islemler = action.payload;
            })
            .addCase(fetchIslemler.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addIslem.fulfilled, (state, action) => {
                state.islemler.push(action.payload);
            })
            .addCase(deleteIslem.fulfilled, (state, action) => {
                state.islemler = state.islemler.filter((islem) => islem.islemId !== action.payload);
            })
            .addCase(updateIslem.fulfilled, (state, action) => {
                const index = state.islemler.findIndex((islem) => islem.islemId === action.payload.islemId);
                if (index >= 0) {
                    state.islemler[index] = { ...state.islemler[index], ...action.payload };
                }
            });

        // GirisIslem CRUD işlemleri
        builder
            .addCase(fetchGirisIslemler.fulfilled, (state, action) => {
                state.girisIslemler = action.payload;
            })
            .addCase(addGirisIslem.fulfilled, (state, action) => {
                state.girisIslemler.push(action.payload);
            })
            .addCase(deleteGirisIslem.fulfilled, (state, action) => {
                state.girisIslemler = state.girisIslemler.filter((girisIslem) => girisIslem.girisIslemId !== action.payload);
            })
            .addCase(updateGirisIslem.fulfilled, (state, action) => {
                const index = state.girisIslemler.findIndex((girisIslem) => girisIslem.girisIslemId === action.payload.girisIslemId);
                if (index >= 0) {
                    state.girisIslemler[index] = { ...state.girisIslemler[index], ...action.payload };
                }
            });

        // CikisIslem CRUD işlemleri
        builder
            .addCase(fetchCikisIslemler.fulfilled, (state, action) => {
                state.cikisIslemler = action.payload;
            })
            .addCase(addCikisIslem.fulfilled, (state, action) => {
                state.cikisIslemler.push(action.payload);
            })
            .addCase(deleteCikisIslem.fulfilled, (state, action) => {
                state.cikisIslemler = state.cikisIslemler.filter((cikisIslem) => cikisIslem.cikisIslemId !== action.payload);
            })
            .addCase(updateCikisIslem.fulfilled, (state, action) => {
                const index = state.cikisIslemler.findIndex((cikisIslem) => cikisIslem.cikisIslemId === action.payload.cikisIslemId);
                if (index >= 0) {
                    state.cikisIslemler[index] = { ...state.cikisIslemler[index], ...action.payload };
                }
            });

        // IadeIslem CRUD işlemleri
        builder
            .addCase(fetchIadeIslemler.fulfilled, (state, action) => {
                state.iadeIslemler = action.payload;
            })
            .addCase(addIadeIslem.fulfilled, (state, action) => {
                state.iadeIslemler.push(action.payload);
            })
            .addCase(deleteIadeIslem.fulfilled, (state, action) => {
                state.iadeIslemler = state.iadeIslemler.filter((iadeIslem) => iadeIslem.iadeIslemId !== action.payload);
            })
            .addCase(updateIadeIslem.fulfilled, (state, action) => {
                const index = state.iadeIslemler.findIndex((iadeIslem) => iadeIslem.iadeIslemId === action.payload.iadeIslemId);
                if (index >= 0) {
                    state.iadeIslemler[index] = { ...state.iadeIslemler[index], ...action.payload };
                }
            });

        // IslemTur CRUD işlemleri
        builder
            .addCase(fetchIslemTurler.fulfilled, (state, action) => {
                state.islemTurler = action.payload;
            })
            .addCase(addIslemTur.fulfilled, (state, action) => {
                state.islemTurler.push(action.payload);
            })
            .addCase(deleteIslemTur.fulfilled, (state, action) => {
                state.islemTurler = state.islemTurler.filter((islemTur) => islemTur.islemTurId !== action.payload);
            })
            .addCase(updateIslemTur.fulfilled, (state, action) => {
                const index = state.islemTurler.findIndex((islemTur) => islemTur.islemTurId === action.payload.islemTurId);
                if (index >= 0) {
                    state.islemTurler[index] = { ...state.islemTurler[index], ...action.payload };
                }
            });
    },
});

export default siparisSlice.reducer;
