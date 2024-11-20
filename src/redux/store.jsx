import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import calisanSlice from './calisanSlice'
import magazaSlice from './magazaSlice'
import fabrikaSlice from './fabrikaSlice'
import depoSlice from './depoSlice'
import kategoriSlice from './kategoriSlice'
import siparisSlice from './siparisSlice'
import urunSlice from './urunSlice'
export const store = configureStore({
        reducer: {
                login: loginSlice,
                calisan: calisanSlice,
                magaza: magazaSlice,
                fabrika: fabrikaSlice,
                depo: depoSlice,
                kategori: kategoriSlice,
                siparis: siparisSlice,
                urun: urunSlice
        },
})