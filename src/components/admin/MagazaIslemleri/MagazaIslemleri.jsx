/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMagazalar, deleteMagaza, updateMagaza, addMagaza } from '../../../redux/magazaSlice';
import './MagazaIslemleri.css';

const MagazaIslemleri = () => {
    const dispatch = useDispatch();
    const { magazalar, status, error } = useSelector((state) => state.magaza);

    const [selectedMagaza, setSelectedMagaza] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Yeni mağaza ekleme formu durumu
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMagazaData, setNewMagazaData] = useState({
        magazaAdi: '',
        adres: '',
        telefonNo: '',
        mail: '',
        sifre: ''
    });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMagazalar());
        }
    }, [dispatch, status]);

    const handleDetail = (magaza) => {
        setSelectedMagaza(magaza);
    };

    const handleCloseDetail = () => {
        setSelectedMagaza(null);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteMagaza(deleteId));
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const handleUpdate = (id) => {
        const magaza = magazalar.find((m) => m.magazaId === id);
        setFormData(magaza);
        setShowUpdateForm(true);
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
        dispatch(updateMagaza({ magazaId: formData.magazaId, updatedData: formData }));
        setShowUpdateForm(false);
    };

    // Yeni mağaza ekleme işlemi
    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewMagazaData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        dispatch(addMagaza(newMagazaData));
        setShowAddForm(false);
        setNewMagazaData({ magazaAdi: '', adres: '', telefonNo: '', mail: '', sifre: '' }); // Formu sıfırla
    };

    if (status === 'loading') return <div className="status">Yükleniyor...</div>;
    if (status === 'failed') return <div className="status">Hata: {error}</div>;

    return (
        <div className="magaza-container">
            <h1>Mağazalar</h1>
            <button className="add-button" onClick={() => setShowAddForm(true)}>Yeni Mağaza Ekle</button>
            <ul className="magaza-list">
                {magazalar.map((magaza) => (
                    <li key={magaza.magazaId} className="magaza-card">
                        <div className="magaza-info">
                            <strong>{magaza.magazaAdi}</strong>
                        </div>
                        <br />
                        <div className="magaza-info">
                            <strong>{magaza.telefonNo}</strong>
                        </div>
                        <div className="magaza-actions">
                            <button className="detail-button" onClick={() => handleDetail(magaza)}>Detay</button>
                            <button className="update-button" onClick={() => handleUpdate(magaza.magazaId)}>Güncelle</button>
                            <button className="delete-button" onClick={() => handleDelete(magaza.magazaId)}>Sil</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Yeni Mağaza Ekleme Formu (Modal olarak açılıyor) */}
            {showAddForm && (
                <div className="add-modal">
                    <div className="add-content">
                        <h2>Yeni Mağaza Ekle</h2>
                        <form onSubmit={handleAddSubmit}>
                            <label>Mağaza Adı:</label>
                            <input
                                type="text"
                                name="magazaAdi"
                                value={newMagazaData.magazaAdi}
                                onChange={handleAddInputChange}
                            />
                            <label>Adres:</label>
                            <input
                                type="text"
                                name="adres"
                                value={newMagazaData.adres}
                                onChange={handleAddInputChange}
                            />
                            <label>Telefon:</label>
                            <input
                                type="text"
                                name="telefonNo"
                                value={newMagazaData.telefonNo}
                                onChange={handleAddInputChange}
                            />
                            <label>Mail:</label>
                            <input
                                type="email"
                                name="mail"
                                value={newMagazaData.mail}
                                onChange={handleAddInputChange}
                            />
                            <label>Sifre:</label>
                            <input
                                type="email"
                                name="sifre"
                                value={newMagazaData.sifre}
                                onChange={handleAddInputChange}
                            />
                            <button type="submit" className="add-submit-button">Ekle</button>
                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowAddForm(false)}
                            >
                                Kapat
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detay Modali */}
            {selectedMagaza && (
                <div className="detail-modal">
                    <div className="detail-content">
                        <h2>Mağaza Detayları</h2>
                        <p><strong>Mağaza Adı:</strong> {selectedMagaza.magazaAdi}</p>
                        <p><strong>Adres:</strong> {selectedMagaza.adres}</p>
                        <p><strong>Telefon:</strong> {selectedMagaza.telefonNo}</p>
                        <p><strong>Mail:</strong> {selectedMagaza.mail}</p>
                        <button className="close-button" onClick={handleCloseDetail}>Kapat</button>
                    </div>
                </div>
            )}

            {/* Güncelleme Formu */}
            {showUpdateForm && (
                <div className="update-modal">
                    <div className="update-content">
                        <h2>Mağaza Bilgilerini Güncelle</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>Mağaza Adı:</label>
                            <input
                                type="text"
                                name="magazaAdi"
                                value={formData.magazaAdi}
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
                                value={formData.telefonNo}
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

export default MagazaIslemleri;
