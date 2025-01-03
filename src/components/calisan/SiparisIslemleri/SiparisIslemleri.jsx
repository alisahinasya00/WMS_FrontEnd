/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCikisIslemler,
    fetchIadeIslemler,
    updateCikisIslem,
    updateIadeIslem,
} from '../../../redux/siparisSlice';
import './SiparisIslemleri.css';
import { fetchMagazalar } from '../../../redux/magazaSlice';
import { fetchUrunler } from '../../../redux/urunSlice';
import { fetchCalisanlar } from '../../../redux/calisanSlice';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const SiparisIslemleri = () => {
    const dispatch = useDispatch();

    // Redux store'dan veriler
    const magazalar = useSelector((state) => state.magaza.magazalar);
    const calisanlar = useSelector((state) => state.calisan.calisanlar);
    const urunler = useSelector((state) => state.urun.urunler);
    const cikisIslemler = useSelector((state) => state.siparis.cikisIslemler);
    const iadeIslemler = useSelector((state) => state.siparis.iadeIslemler);

    // Kullanıcı mesaj durumu
    const [message, setMessage] = useState('');

    const calisanMail = localStorage.getItem('userMail');
    const mevcutCalisan = calisanlar.find((calisan) => calisan.mail === calisanMail);

    useEffect(() => {
        dispatch(fetchCikisIslemler());
        dispatch(fetchIadeIslemler());
        dispatch(fetchMagazalar());
        dispatch(fetchUrunler());
        dispatch(fetchCalisanlar());
    }, [dispatch]);

    if (!mevcutCalisan) {
        return <div>Giriş yapılan çalışanın bilgileri bulunamadı.</div>;
    }

    const handleUpdate = (islem, type, status) => {
        const urun = urunler.find((urun) => urun.adi === islem.urunAdi);
        const magaza = magazalar.find((magaza) => magaza.magazaAdi === islem.magazaAdi);

        if (!urun || !magaza) {
            alert('Ürün veya mağaza bilgileri bulunamadı!');
            return;
        }

        const updatedData = {
            durum: status,
            urunID: urun.urunId,
            islemTurID: type === 'cikis' ? 3 : 2,
            magazaID: magaza.magazaId,
            calisanID: mevcutCalisan.calisanId,
            urunAdedi: islem.urunAdedi,
            islemTarihi: islem.islemTarihi,
            ...(type === 'cikis'
                ? { cikisIslemId: islem.cikisIslemId }
                : { iadeIslemId: islem.iadeIslemId }),
        };

        if (type === 'cikis') {
            dispatch(updateCikisIslem({ updatedData })).then(() => {
                //  setMessage('Çıkış işlemi başarıyla onaylandı!');
                dispatch(fetchCikisIslemler());
            });
        } else if (type === 'iade') {
            dispatch(updateIadeIslem({ updatedData })).then(() => {
                //setMessage('İade işlemi başarıyla onaylandı!');
                dispatch(fetchIadeIslemler());
            });
        }

        setTimeout(() => setMessage(''), 3000); // Mesajı 3 saniye sonra temizle
    };

    const allOperations = [
        ...cikisIslemler.map((islem) => ({ ...islem, islemTur: 'Çıkış' })),
        ...iadeIslemler.map((islem) => ({ ...islem, islemTur: 'İade' })),
    ];

    const confirmCancel = (islem, type) => {
        if (window.confirm('Bu işlemi iptal etmek istediğinize emin misiniz?')) {
            handleUpdate(islem, type, 'İptal Edildi');
        }
    };

    return (
        <div className="calisan_iptal">
            <h1 className="calisan_siparisler-baslik">Sevk ve İade Sipariş İşlemleri</h1>

            {message && <div className="success-message">{message}</div>}

            <table>
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Ürün Adedi</th>
                        <th>İşlem Tarihi</th>
                        <th>Durum</th>
                        <th>İşlem Türü</th>
                        <th>Mağaza</th>
                        <th>İptal</th>
                        <th>Onay</th>
                    </tr>
                </thead>
                <tbody>
                    {allOperations.length > 0 ? (
                        allOperations.map((islem) => (
                            <tr key={`${islem.islemId}-${islem.islemTur}`}>
                                <td>{islem.urunAdi}</td>
                                <td>{islem.urunAdedi}</td>
                                <td>{new Date(islem.islemTarihi).toLocaleDateString('tr-TR')}</td>
                                <td>{islem.durum}</td>
                                <td>{islem.islemTur}</td>
                                <td>{islem.magazaAdi}</td>
                                <td>
                                    {islem.durum === 'Bekliyor' ? (
                                        <AiOutlineClose
                                            size={24}
                                            color="red"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                confirmCancel(
                                                    islem,
                                                    islem.islemTur === 'Çıkış' ? 'cikis' : 'iade'
                                                )
                                            }
                                        />
                                    ) : (
                                        <AiOutlineClose size={24} color="gray" />
                                    )}
                                </td>
                                <td>
                                    {islem.durum === 'Bekliyor' ? (
                                        <AiOutlineCheck
                                            size={24}
                                            color="green"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() =>
                                                handleUpdate(
                                                    islem,
                                                    islem.islemTur === 'Çıkış' ? 'cikis' : 'iade',
                                                    'Onaylandı'
                                                )
                                            }
                                        />
                                    ) : (
                                        <AiOutlineCheck size={24} color="gray" />
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>
                                Çalışan için işlem bulunmamaktadır.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SiparisIslemleri;
