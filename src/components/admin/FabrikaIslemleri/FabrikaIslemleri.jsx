/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFabrikalar, deleteFabrika, updateFabrika, addFabrika } from '../../../redux/fabrikaSlice';
import './FabrikaIslemleri.css';

const FabrikaIslemleri = () => {
    const dispatch = useDispatch();
    const { fabrikalar, status, error } = useSelector((state) => state.fabrika);
    const [selectedFabrika, setSelectedFabrika] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newFabrika, setNewFabrika] = useState({ adres: '', telefonNo: '' });

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
            .catch(() => {
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
            .catch(() => {
                setErrorMessage("Güncelleme işlemi sırasında bir hata oluştu.");
            });
    };

    const handleErrorMessageClose = () => {
        setErrorMessage(null);
        dispatch(fetchFabrikalar());
    };

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
            .catch(() => {
                setErrorMessage("Fabrika eklenirken bir hata oluştu.");
            });
    };

    const handleAddFabrikaClick = () => {
        setShowAddForm(true);
    };

    if (status === 'loading') return <div className="status">Loading...</div>;
    if (status === 'failed') return <div className="status">Error: {error}</div>;

    return (
        <div className="fabrika-container">
            <h1>Fabrikalar</h1>
            <button className="add-button" onClick={handleAddFabrikaClick}>Yeni Fabrika Ekle</button>

            {showAddForm && (
                <div className="modal">
                    <div className="modal-content">
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

            <div className="fabrika-list">
                {fabrikalar.map((fabrika) => (
                    <div key={fabrika.fabrikaId} className="fabrika-card">
                        <strong>{fabrika.adres || 'Adres Bulunamadı'}</strong>
                        <div className="fabrika-actions">
                            <button className="detail-button" onClick={() => handleDetail(fabrika)}>Detay</button>
                            <button className="update-button" onClick={() => handleUpdate(fabrika.fabrikaId)}>Güncelle</button>
                            <button className="delete-button" onClick={() => handleDelete(fabrika.fabrikaId)}>Sil</button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedFabrika && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-icon" onClick={handleCloseDetail}>&times;</button>
                        <h2>Fabrika Detayları</h2>
                        <p><strong>Adres:</strong> {selectedFabrika.adres || 'Adres Bulunamadı'}</p>
                        <p><strong>Telefon:</strong> {selectedFabrika.telefonNo}</p>
                    </div>
                </div>
            )}

            {/* Güncelleme ve diğer modal kodları yukarıdaki ile benzer şekilde tasarlanmıştır */}
        </div>
    );
};

export default FabrikaIslemleri;
