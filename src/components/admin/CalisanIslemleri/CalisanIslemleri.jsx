/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalisanlar } from '../../../redux/calisanSlice'; // Redux slice'ını import et

const CalisanIslemleri = () => {
    const dispatch = useDispatch();
    const { calisanlar, status, error } = useSelector((state) => state.calisan);

    // Component ilk render edildiğinde veriyi çekmek için useEffect kullanıyoruz
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalisanlar());
        }
    }, [dispatch, status]);

    // Eğer veriler yükleniyorsa veya hata varsa durumları gösteriyoruz
    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Çalışanlar</h1>
            <ul>
                {calisanlar.map((calisan) => (
                    <li key={calisan.calisanId}>
                        <strong>{calisan.adi} {calisan.soyadi}</strong><br />
                        <span>Rol: {calisan.rolAdi}</span><br />
                        <span>Mail: {calisan.mail}</span><br />
                        <span>Telefon: {calisan.telefonNo}</span><br />
                        <span>Adres: {calisan.adres}</span><br />
                        <span>Maaş: {calisan.maas}₺</span><br />
                        <span>İşe Giriş Tarihi: {new Date(calisan.iseGirisTarihi).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CalisanIslemleri;
