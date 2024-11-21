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
        console.log('Updated Data:', formData);
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
        dispatch(updateMagaza({ updatedData: formData }))
            .then(() => {
                dispatch(fetchMagazalar()); // Ekranı güncelle
            });
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

    const handleAddMagazaSubmit = (e) => {
        e.preventDefault();
        dispatch(addMagaza(newMagazaData))
            .then(() => {
                setShowAddForm(false);
                setNewMagazaData({
                    magazaAdi: '',
                    adres: '',
                    telefonNo: '',
                    mail: '',
                    sifre: ''
                }); // Form verilerini sıfırla
                dispatch(fetchMagazalar());
            })
            .catch((error) => {
                //setErrorMessage("Fabrika eklenirken bir hata oluştu.");
            });
    };

    const handleAddMagazaClick = () => {
        setShowAddForm(true); // Yeni fabrika ekleme formunu göster
    };

    if (status === 'loading') return <div className="status">Yükleniyor...</div>;
    if (status === 'failed') return <div className="status">Hata: {error}</div>;

    return (
        <div className="magaza-container">
            <h1>Mağazalar</h1>
            <button className="magaza-add-button" onClick={handleAddMagazaClick}>Yeni Mağaza Ekle</button>
            <ul className="magaza-list">
                {magazalar.map((magaza) => (
                    <li key={magaza.magazaId} className="magaza-card">
                        <div className="magaza-info">
                            <strong>{magaza.magazaAdi}</strong>
                        </div>
                        <div className="magaza-info">
                            <strong>{magaza.telefonNo}</strong>
                        </div>
                        <div className="magaza-actions">
                            <button className="magaza-detail-button" onClick={() => handleDetail(magaza)}>Detay</button>
                            <button className="magaza-update-button" onClick={() => handleUpdate(magaza.magazaId)}>Güncelle</button>
                            <button className="magaza-delete-button" onClick={() => handleDelete(magaza.magazaId)}>Sil</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Yeni Mağaza Ekleme Formu (Modal olarak açılıyor) */}
            {showAddForm && (
                <div className="magaza-modal">
                    <div className="magaza-modal-content">
                        <h2>Yeni Mağaza Ekle</h2>
                        <form onSubmit={handleAddMagazaSubmit}>
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
                                type="password"
                                name="sifre"
                                value={newMagazaData.sifre}
                                onChange={handleAddInputChange}
                            />
                            <button type="submit" className="magaza-update-submit-button">Ekle</button>
                            <button
                                type="button"
                                className="magaza-close-button"
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
                <div className="magaza-detail-modal">
                    <div className="magaza-detail-content">
                        <h2>Mağaza Detayları</h2>
                        <p><strong>Mağaza Adı:</strong> {selectedMagaza.magazaAdi}</p>
                        <p><strong>Adres:</strong> {selectedMagaza.adres}</p>
                        <p><strong>Telefon:</strong> {selectedMagaza.telefonNo}</p>
                        <p><strong>Mail:</strong> {selectedMagaza.mail}</p>
                        <button className="magaza-close-button" onClick={handleCloseDetail}>Kapat</button>
                    </div>
                </div>
            )}

            {/* Güncelleme Formu */}
            {showUpdateForm && (
                <div className="magaza-update-modal">
                    <div className="magaza-update-content">
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
                                name="telefonNo"
                                value={formData.telefonNo}
                                onChange={handleInputChange}
                            />
                            <label>Mail:</label>
                            <input
                                type="email"
                                name="mail"
                                value={formData.mail}
                                onChange={handleInputChange}
                            />
                            <label>Sifre:</label>
                            <input
                                type="text"
                                name="sifre"
                                value={formData.sifre}
                                onChange={handleInputChange}
                            />
                            <button type="submit" className="magaza-update-submit-button">Güncelle</button>
                            <button
                                type="button"
                                className="magaza-close-button"
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
                <div className="magaza-delete-confirm-modal">
                    <div className="magaza-delete-confirm-content">
                        <h2>Silmek İstediğinizden Emin Misiniz?</h2>
                        <button className="magaza-delete-confirm-button" onClick={handleDeleteConfirm}>Evet, Sil</button>
                        <button className="magaza-delete-cancel-button" onClick={handleDeleteCancel}>Hayır, Vazgeç</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagazaIslemleri;
