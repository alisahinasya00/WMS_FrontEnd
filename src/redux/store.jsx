import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import calisanSlice from './calisanSlice'

export const store = configureStore({
    reducer: {
        login: loginSlice,
        calisan: calisanSlice
    },
})