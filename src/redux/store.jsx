import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import calisanSlice from './calisanSlice'
import magazaSlice from './magazaSlice'

export const store = configureStore({
    reducer: {
        login: loginSlice,
        calisan: calisanSlice,
        magaza: magazaSlice
    },
})