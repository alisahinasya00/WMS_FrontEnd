import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import calisanSlice from './calisanSlice'
import magazaSlice from './magazaSlice'
import fabrikaSlice from './fabrikaSlice'
import depoSlice from './DepoSlice'

export const store = configureStore({
    reducer: {
        login: loginSlice,
        calisan: calisanSlice,
        magaza: magazaSlice,
        fabrika: fabrikaSlice,
        depo: depoSlice
    },
})