/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCikisIslemler, fetchIadeIslemler, updateCikisIslem, updateIadeIslem, deleteCikisIslem, deleteIadeIslem } from '../../../redux/siparisSlice';
import { fetchMagazalar } from '../../../redux/magazaSlice';
import { fetchUrunler } from '../../../redux/urunSlice';
import './SiparisIslemleri.css';

const SiparisIslemleri = () => {
    const dispatch = useDispatch();

    // Redux store'dan mağaza ve sipariş verilerini al
    const magazalar = useSelector((state) => state.magaza.magazalar);
    const urunler = useSelector((state) => state.urun.urunler);
    const cikisIslemler = useSelector((state) => state.siparis.cikisIslemler);
    const iadeIslemler = useSelector((state) => state.siparis.iadeIslemler);

    // Giriş yapılan mağazanın bilgisi
    const magazaMail = localStorage.getItem('magazaMail');
    const magaza = magazalar.find((magaza) => magaza.mail === magazaMail);

    // Mağaza ID'sine göre filtrelenen işlemler
    const getFilteredOperations = () => {
        if (!magaza) return [];
        const magazaAdi = magaza.magazaAdi;

        const cikisFiltered = cikisIslemler.filter((islem) => islem.magazaAdi === magazaAdi);
        const iadeFiltered = iadeIslemler.filter((islem) => islem.magazaAdi === magazaAdi);

        return [...cikisFiltered, ...iadeFiltered];
    };

    // İptal işlemi
    const handleCancel = (islem, type) => {
        const confirmCancel = window.confirm("Bu işlemi iptal etmek istediğinizden emin misiniz?");
        if (!confirmCancel) return;
        const islemTurId = type === 'cikis' ? 3 : type === 'iade' ? 2 : null;
        const urun = urunler.find((urun) => urun.adi === islem.urunAdi);
        // updatedData oluşturulurken islemId yerine uygun ID gönderiliyor
        const updatedData = {
            urunID: urun.urunId,
            urunAdedi: islem.urunAdedi,
            calisanID: 2,
            islemTurID: islemTurId,
            magazaID: magaza.magazaId,
            durum: 'İptal Edildi',
            islemTarihi: new Date().toISOString(),
            ...(type === 'cikis'
                ? { cikisIslemId: islem.cikisIslemId }
                : { iadeIslemId: islem.iadeIslemId }),
        };
        if (type === 'cikis') {
            console.log("cikis iptal güncelleme", updatedData);
            dispatch(updateCikisIslem({ updatedData }));
            dispatch(fetchCikisIslemler())
            dispatch(fetchIadeIslemler())
            dispatch(fetchUrunler())
        } else if (type === 'iade') {
            console.log("iade iptal güncelleme", updatedData);
            dispatch(updateIadeIslem({ updatedData }));
            dispatch(fetchCikisIslemler())
            dispatch(fetchIadeIslemler())
            dispatch(fetchUrunler())
        }
    };

    // Gerekli verileri çek
    useEffect(() => {
        dispatch(fetchCikisIslemler());
        dispatch(fetchIadeIslemler());
        dispatch(fetchMagazalar());
        dispatch(fetchUrunler());
    }, [dispatch]);

    if (!magaza) {
        return <div>Giriş yapılan mağazanın bilgileri bulunamadı.</div>;
    }

    return (
        <div className="magaza_iptal">
            <h1 className="magaza_siparisler-baslik">{magaza.magazaAdi} Sipariş İade İşlemleri</h1>
            <table>
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Ürün Adedi</th>
                        <th>İşlem Tarihi</th>
                        <th>Durum</th>
                        <th>İşlem Türü</th>
                        <th>İptal Et</th> {/* Yeni sütun */}
                    </tr>
                </thead>
                <tbody>
                    {getFilteredOperations().length > 0 ? (
                        getFilteredOperations().map((islem) => (
                            <tr key={islem.islemId}>
                                <td>{islem.urunAdi}</td>
                                <td>{islem.urunAdedi}</td>
                                <td>{new Date(islem.islemTarihi).toLocaleDateString('tr-TR')}</td>
                                <td>{islem.durum}</td>
                                <td>{islem.islemAdi}</td>
                                <td>
                                    {islem.durum === 'Bekliyor' ? (
                                        <button
                                            onClick={() =>
                                                handleCancel(islem, islem.islemAdi === 'Çıkış' ? 'cikis' : 'iade')}
                                        >
                                            İptal Et
                                        </button>
                                    ) : (
                                        <button disabled>İptal Edilemez</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }} >
                                Seçili mağaza için işlem bulunmamaktadır.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SiparisIslemleri;
