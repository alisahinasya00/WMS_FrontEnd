/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFabrikalar, deleteFabrika, updateFabrika, addFabrika } from '../../../redux/fabrikaSlice';
import './FabrikaIslemleri.css';

const FabrikaIslemleri = () => {
    const dispatch = useDispatch();
    const { fabrikalar, status, error } = useSelector((state) => state.fabrika);
    const [selectedFabrika, setSelectedFabrika] = useState(null); // Detay gösterimi için durum
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Güncelleme formu gösterimi için durum
    const [formData, setFormData] = useState({}); // Güncelleme formu verisi
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Silme onayı durumu
    const [deleteId, setDeleteId] = useState(null); // Silinecek fabrika ID'si
    const [errorMessage, setErrorMessage] = useState(null); // Hata mesajı
    const [showAddForm, setShowAddForm] = useState(false); // Yeni fabrika ekleme formu
    const [newFabrika, setNewFabrika] = useState({ adres: '', telefonNo: '' }); // Yeni fabrika verisi

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
        const fabrika = fabrikalar.find(f => f.fabrikaId === id);
        if (fabrika.girisIslemler && fabrika.girisIslemler.length > 0) {
            setErrorMessage("Bu fabrikaya ait bir işlem olduğu için silinememektedir.");
            setShowDeleteConfirm(false);
        } else {
            setDeleteId(id);
            setShowDeleteConfirm(true);
        }
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteFabrika(deleteId))
            .then(() => {
                setShowDeleteConfirm(false);
                dispatch(fetchFabrikalar());
            })
            .catch((error) => {
                setErrorMessage("Silme işlemi sırasında bir hata oluştu.");
                setShowDeleteConfirm(false);
            });
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const handleUpdate = (id) => {
        const fabrika = fabrikalar.find((f) => f.fabrikaId === id);
        setFormData(fabrika);
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
        dispatch(updateFabrika({ updatedData: formData }))
            .then(() => {
                setShowUpdateForm(false);
                dispatch(fetchFabrikalar());
            })
            .catch((error) => {
                setErrorMessage("Güncelleme işlemi sırasında bir hata oluştu.");
            });
    };

    const handleErrorMessageClose = () => {
        setErrorMessage(null);
        dispatch(fetchFabrikalar());
    };

    // Yeni fabrika ekleme işlemi
    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setNewFabrika((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddFabrikaSubmit = (e) => {
        e.preventDefault();
        dispatch(addFabrika(newFabrika))
            .then(() => {
                setShowAddForm(false);
                dispatch(fetchFabrikalar());
            })
            .catch((error) => {
                setErrorMessage("Fabrika eklenirken bir hata oluştu.");
            });
    };

    const handleAddFabrikaClick = () => {
        setShowAddForm(true); // Yeni fabrika ekleme formunu göster
    };

    if (status === 'loading') return <div className="status">Loading...</div>;
    if (status === 'failed') return <div className="status">Error: {error}</div>;

    return (
        <div className="fabrika-container">
            <h1>Fabrikalar</h1>
            <button className="update-button" onClick={handleAddFabrikaClick}>Yeni Fabrika Ekle</button>

            {/* Yeni Fabrika Ekleme Formu */}
            {showAddForm && (
                <div className="update-modal">
                    <div className="update-content">
                        <h2>Yeni Fabrika Ekle</h2>
                        <form onSubmit={handleAddFabrikaSubmit}>
                            <label>Adres:</label>
                            <input
                                type="text"
                                name="adres"
                                value={newFabrika.adres}
                                onChange={handleAddFormChange}
                            />
                            <label>Telefon No:</label>
                            <input
                                type="text"
                                name="telefonNo"
                                value={newFabrika.telefonNo}
                                onChange={handleAddFormChange}
                            />
                            <button type="submit" className="update-submit-button">Ekle</button>
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

            <ul className="fabrika-list">
                {fabrikalar.map((fabrika) => (
                    <li key={fabrika.fabrikaId} className="fabrika-card">
                        <div className="fabrika-info">
                            <strong>{fabrika.adres || 'Adres Bulunamadı'}</strong>
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
                        <p><strong>Adres:</strong> {selectedFabrika.adres || 'Adres Bulunamadı'}</p>
                        <p><strong>Telefon:</strong> {selectedFabrika.telefonNo}</p>
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
                            <label>Adres:</label>
                            <input
                                type="text"
                                name="adres"
                                value={formData.adres || ''}
                                onChange={handleInputChange}
                            />
                            <label>Telefon No:</label>
                            <input
                                type="text"
                                name="telefonNo"
                                value={formData.telefonNo || ''}
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

            {/* Hata Mesajı */}
            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                    <button onClick={handleErrorMessageClose}>Kapat</button>
                </div>
            )}
        </div>
    );
};

export default FabrikaIslemleri;
