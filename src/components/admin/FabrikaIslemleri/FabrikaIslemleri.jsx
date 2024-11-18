/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFabrikalar, deleteFabrika, updateFabrika } from '../../../redux/fabrikaSlice';
import './FabrikaIslemleri.css';

const FabrikaIslemleri = () => {
    const dispatch = useDispatch();
    const { fabrikalar, status, error } = useSelector((state) => state.fabrika);

    const [selectedFabrika, setSelectedFabrika] = useState(null); // Detay gösterimi için durum
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Güncelleme formu gösterimi için durum
    const [formData, setFormData] = useState({}); // Güncelleme formu verisi
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Silme onayı durumu
    const [deleteId, setDeleteId] = useState(null); // Silinecek fabrika ID'si

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchFabrikalar());
        }
    }, [dispatch, status]);

    const handleDetail = (fabrika) => {
        setSelectedFabrika(fabrika);
    };

    const handleCloseDetail = () => {
        setSelectedFabrika(null);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true); // Silme onayı modalını göster
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteFabrika(deleteId));
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false); // Silme onayını kapat
    };

    const handleUpdate = (id) => {
        const fabrika = fabrikalar.find((f) => f.fabrikaId === id);
        setFormData(fabrika);
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
        dispatch(updateFabrika({ fabrikaId: formData.fabrikaId, updatedData: formData }));
        setShowUpdateForm(false);
    };

    if (status === 'loading') return <div className="status">Loading...</div>;
    if (status === 'failed') return <div className="status">Error: {error}</div>;

    return (
        <div className="fabrika-container">
            <h1>Fabrikalar</h1>
            <ul className="fabrika-list">
                {fabrikalar.map((fabrika) => (
                    <li key={fabrika.fabrikaId} className="fabrika-card">
                        <div className="fabrika-info">
                            <strong>{fabrika.isim}</strong>
                        </div>
                        <div className="fabrika-actions">
                            <button className="detail-button" onClick={() => handleDetail(fabrika)}>Detay</button>
                            <button className="update-button" onClick={() => handleUpdate(fabrika.fabrikaId)}>Güncelle</button>
                            <button className="delete-button" onClick={() => handleDelete(fabrika.fabrikaId)}>Sil</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Detay Modali */}
            {selectedFabrika && (
                <div className="detail-modal">
                    <div className="detail-content">
                        <h2>Fabrika Detayları</h2>
                        <p><strong>İsim:</strong> {selectedFabrika.isim}</p>
                        <p><strong>Adres:</strong> {selectedFabrika.adres}</p>
                        <p><strong>Telefon:</strong> {selectedFabrika.telefon}</p>
                        <p><strong>Çalışan Sayısı:</strong> {selectedFabrika.calisanSayisi}</p>
                        <button className="close-button" onClick={handleCloseDetail}>Kapat</button>
                    </div>
                </div>
            )}

            {/* Güncelleme Formu */}
            {showUpdateForm && (
                <div className="update-modal">
                    <div className="update-content">
                        <h2>Fabrika Bilgilerini Güncelle</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>İsim:</label>
                            <input
                                type="text"
                                name="isim"
                                value={formData.isim}
                                onChange={handleInputChange}
                            />
                            <label>Adres:</label>
                            <input
                                type="text"
                                name="adres"
                                value={formData.adres}
                                onChange={handleInputChange}
                            />
                            <label>Telefon:</label>
                            <input
                                type="text"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleInputChange}
                            />
                            <label>Çalışan Sayısı:</label>
                            <input
                                type="number"
                                name="calisanSayisi"
                                value={formData.calisanSayisi}
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

export default FabrikaIslemleri;
