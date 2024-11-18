/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCalisanlar,
    addCalisan,
    updateCalisan,
    deleteCalisan,
    setSelectedCalisan,
    clearSelectedCalisan,
} from '../../../redux/calisanSlice';
import './CalisanIslemleri.css';

const Calisanİslemleri = () => {
    const dispatch = useDispatch();
    const { data, selectedCalisan = null, status = "idle", error = null } = useSelector((state) => state.calisanlar || {});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalisanlar());
        }
    }, [status, dispatch]);

    const handleAdd = () => {
        const newCalisan = {
            adi: 'Yeni',
            soyadi: 'Çalışan',
            rolAdi: 'Developer',
        };
        dispatch(addCalisan(newCalisan));
    };

    const handleUpdate = (calisan) => {
        const updatedCalisan = { ...calisan, rolAdi: 'Güncellenmiş Rol' };
        dispatch(updateCalisan({ calisanId: calisan.calisanId, calisan: updatedCalisan }));
    };

    const handleDelete = (calisanId) => {
        dispatch(deleteCalisan(calisanId));
    };

    const handleDetail = (calisan) => {
        dispatch(setSelectedCalisan(calisan));
        setShowModal(true);
    };

    const closeModal = () => {
        dispatch(clearSelectedCalisan());
        setShowModal(false);
    };

    if (status === 'loading') return <p>Yükleniyor...</p>;
    if (status === 'failed') return <p>Hata: {error}</p>;

    return (
        <div className="calisan-islemleri">
            <h1>Çalışan İşlemleri</h1>
            <button className="add-button" onClick={handleAdd}>
                Yeni Çalışan Oluştur
            </button>
            <table className="calisan-table">
                <thead>
                    <tr>
                        <th>Adı</th>
                        <th>Soyadı</th>
                        <th>Rolü</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((calisan) => (
                        <tr key={calisan.calisanId}>
                            <td>{calisan.adi}</td>
                            <td>{calisan.soyadi}</td>
                            <td>{calisan.rolAdi}</td>
                            <td>
                                <button className="detail-button" onClick={() => handleDetail(calisan)}>
                                    Detay
                                </button>
                                <button className="update-button" onClick={() => handleUpdate(calisan)}>
                                    Güncelle
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(calisan.calisanId)}>
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && selectedCalisan && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Çalışan Detayları</h2>
                        <p><strong>Adı:</strong> {selectedCalisan.adi}</p>
                        <p><strong>Soyadı:</strong> {selectedCalisan.soyadi}</p>
                        <p><strong>Rolü:</strong> {selectedCalisan.rolAdi}</p>
                        <p><strong>ID:</strong> {selectedCalisan.calisanId}</p>
                        <button onClick={closeModal}>Kapat</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calisanİslemleri;
