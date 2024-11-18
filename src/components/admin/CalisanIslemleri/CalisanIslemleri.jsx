/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalisanlar, deleteCalisan, updateCalisan } from '../../../redux/calisanSlice';
import './CalisanIslemleri.css';

const CalisanIslemleri = () => {
    const dispatch = useDispatch();
    const { calisanlar, status, error } = useSelector((state) => state.calisan);

    const [selectedCalisan, setSelectedCalisan] = useState(null); // Detay gösterimi için durum
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Güncelleme formu gösterimi için durum
    const [formData, setFormData] = useState({}); // Güncelleme formu verisi
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Silme onayı durumu
    const [deleteId, setDeleteId] = useState(null); // Silinecek çalışan ID'si

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
        setDeleteId(id);
        setShowDeleteConfirm(true); // Silme onayı modalını göster
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteCalisan(deleteId));
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false); // Silme onayını kapat
    };

    const handleUpdate = (id) => {
        const calisan = calisanlar.find((c) => c.calisanId === id);
        setFormData(calisan);
        setShowUpdateForm(true); // Güncelleme formunu göster
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCalisan({ calisanId: formData.calisanId, updatedData: formData }));
        setShowUpdateForm(false);
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

            {/* Güncelleme Formu */}
            {showUpdateForm && (
                <div className="update-modal">
                    <div className="update-content">
                        <h2>Çalışan Bilgilerini Güncelle</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>Adı:</label>
                            <input
                                type="text"
                                name="adi"
                                value={formData.adi}
                                onChange={handleInputChange}
                            />
                            <label>Soyadı:</label>
                            <input
                                type="text"
                                name="soyadi"
                                value={formData.soyadi}
                                onChange={handleInputChange}
                            />
                            <label>Rol:</label>
                            <input
                                type="text"
                                name="rolAdi"
                                value={formData.rolAdi}
                                onChange={handleInputChange}
                            />
                            <label>Mail:</label>
                            <input
                                type="email"
                                name="mail"
                                value={formData.mail}
                                onChange={handleInputChange}
                            />
                            <label>Telefon:</label>
                            <input
                                type="text"
                                name="telefonNo"
                                value={formData.telefonNo}
                                onChange={handleInputChange}
                            />
                            <label>Adres:</label>
                            <input
                                type="text"
                                name="adres"
                                value={formData.adres}
                                onChange={handleInputChange}
                            />
                            <label>Maaş:</label>
                            <input
                                type="number"
                                name="maas"
                                value={formData.maas}
                                onChange={handleInputChange}
                            />
                            <button type="submit" className="update-submit-button">Güncelle</button>
                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowUpdateForm(false)}
                            >
                                Kapat
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Silme Onayı */}
            {showDeleteConfirm && (
                <div className="delete-confirm-modal">
                    <div className="delete-confirm-content">
                        <h2>Silmek İstediğinizden Emin Misiniz?</h2>
                        <button className="delete-confirm-button" onClick={handleDeleteConfirm}>Evet, Sil</button>
                        <button className="delete-cancel-button" onClick={handleDeleteCancel}>Hayır, Vazgeç</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalisanIslemleri;
