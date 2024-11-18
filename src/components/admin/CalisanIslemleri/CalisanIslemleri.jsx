/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalisanlar } from '../../../redux/calisanSlice';
import './CalisanIslemleri.css';

const CalisanIslemleri = () => {
    const dispatch = useDispatch();
    const { calisanlar, status, error } = useSelector((state) => state.calisan);

    const [selectedCalisan, setSelectedCalisan] = useState(null); // Detay gösterimi için durum

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalisanlar());
        }
    }, [dispatch, status]);

    const handleDetail = (calisan) => {
        setSelectedCalisan(calisan);
    };

    const handleCloseDetail = () => {
        setSelectedCalisan(null);
    };

    const handleDelete = (id) => {
        console.log(`Çalışan ID ${id} silindi.`);
        // Silme işlemini buraya ekleyin (API çağrısı veya Redux action)
    };

    const handleUpdate = (id) => {
        console.log(`Çalışan ID ${id} güncelleniyor.`);
        // Güncelleme işlemini buraya ekleyin (Modal açabilir veya form gösterebilirsiniz)
    };

    if (status === 'loading') return <div className="status">Loading...</div>;
    if (status === 'failed') return <div className="status">Error: {error}</div>;

    return (
        <div className="calisan-container">
            <h1>Çalışanlar</h1>
            <ul className="calisan-list">
                {calisanlar.map((calisan) => (
                    <li key={calisan.calisanId} className="calisan-card">
                        <div className="calisan-info">
                            <strong>{calisan.adi} {calisan.soyadi}</strong>
                        </div>
                        <div className="calisan-actions">
                            <button className="detail-button" onClick={() => handleDetail(calisan)}>Detay</button>
                            <button className="update-button" onClick={() => handleUpdate(calisan.calisanId)}>Güncelle</button>
                            <button className="delete-button" onClick={() => handleDelete(calisan.calisanId)}>Sil</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Detay Modali */}
            {selectedCalisan && (
                <div className="detail-modal">
                    <div className="detail-content">
                        <h2>Çalışan Detayları</h2>
                        <p><strong>Ad Soyad:</strong> {selectedCalisan.adi} {selectedCalisan.soyadi}</p>
                        <p><strong>Rol:</strong> {selectedCalisan.rolAdi}</p>
                        <p><strong>Mail:</strong> {selectedCalisan.mail}</p>
                        <p><strong>Telefon:</strong> {selectedCalisan.telefonNo}</p>
                        <p><strong>Adres:</strong> {selectedCalisan.adres}</p>
                        <p><strong>Maaş:</strong> {selectedCalisan.maas}₺</p>
                        <p><strong>İşe Giriş Tarihi:</strong> {new Date(selectedCalisan.iseGirisTarihi).toLocaleDateString()}</p>
                        <button className="close-button" onClick={handleCloseDetail}>Kapat</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalisanIslemleri;
