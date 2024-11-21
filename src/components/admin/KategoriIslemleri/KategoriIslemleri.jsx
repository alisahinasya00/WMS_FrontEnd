
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKategoriler, deleteKategori, updateKategori, addKategori } from '../../../redux/kategoriSlice';
import './KategoriIslemleri.css';

const KategoriIslemleri = () => {
    const dispatch = useDispatch();
    const { kategoriler, status, error } = useSelector((state) => state.kategori);
    const [formData, setFormData] = useState({ kategoriAdi: '' }); // Güncelleme ve ekleme formu verisi
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Güncelleme formu gösterimi
    const [showAddForm, setShowAddForm] = useState(false); // Yeni kategori ekleme formu
    const [updateId, setUpdateId] = useState(null); // Güncellenecek kategori ID'si
    const [deleteId, setDeleteId] = useState(null); // Silinecek kategori ID'si
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Silme onayı durumu

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchKategoriler());
        }
    }, [dispatch, status]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddKategoriSubmit = (e) => {
        e.preventDefault();
        dispatch(addKategori(formData))
            .then(() => {
                setShowAddForm(false);
                setFormData({ kategoriAdi: '' });
                dispatch(fetchKategoriler());
            })
            .catch((error) => {
                console.error('Kategori eklenirken bir hata oluştu:', error);
            });
    };

    const handleUpdateKategoriSubmit = async (e) => {
        e.preventDefault();

        // Backend'in beklediği veri yapısını hazırlayın
        const updatedData = {
            kategoriId: updateId, // Güncellenecek kategori ID'si
            kategoriAdi: formData.kategoriAdi, // Kategori adı
        };

        try {
            // Kategori güncelleme isteği
            await dispatch(
                updateKategori({
                    updatedData, // Gönderilen veri
                })
            ).unwrap(); // unwrap ile olası hataları yakala

            // Güncelleme sonrası UI güncellemesi ve form temizliği
            setShowUpdateForm(false);
            setFormData({ kategoriAdi: '' });

            // Güncellenmiş kategoriler listesi yeniden alınır
            dispatch(fetchKategoriler());
        } catch (error) {
            // Hata durumunda loglama
            console.error('Kategori güncellenirken bir hata oluştu:', error);
        }
    };


    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteKategori(deleteId))
            .then(() => {
                setShowDeleteConfirm(false);
                dispatch(fetchKategoriler());
            })
            .catch((error) => {
                console.error('Kategori silinirken bir hata oluştu:', error);
            });
    };

    const handleUpdate = (id, kategoriAdi) => {
        setUpdateId(id);
        setFormData({ kategoriAdi });
        setShowUpdateForm(true);
    };

    if (status === 'loading') return <div className="status">Loading...</div>;
    if (status === 'failed') return <div className="status">Error: {error}</div>;

    return (
        <div className="kategori-container">
            <h1>Kategoriler</h1>
            <button className="kategori-add-button" onClick={() => setShowAddForm(true)}>Yeni Kategori Ekle</button>
            <ul className="kategori-list">
                {kategoriler.map((kategori) => (
                    <li key={kategori.kategoriId} className="kategori-card">
                        <div className="kategori-info">
                            <strong>{kategori.kategoriAdi}</strong>
                        </div>
                        <div className="kategori-actions">
                            <button className="kategori-update-button" onClick={() => handleUpdate(kategori.kategoriId, kategori.kategoriAdi)}>Güncelle</button>
                            <button className="kategori-delete-button" onClick={() => handleDelete(kategori.kategoriId)}>Sil</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Yeni Kategori Ekleme Formu */}
            {showAddForm && (
                <div className="kategori-modal">
                    <div className="kategori-modal-content">
                        <h2>Yeni Kategori Ekle</h2>
                        <form onSubmit={handleAddKategoriSubmit}>
                            <label>Kategori Adı:</label>
                            <input
                                type="text"
                                name="kategoriAdi"
                                value={formData.kategoriAdi}
                                onChange={handleInputChange}
                            />
                            <button type="submit" className="kategori-update-submit-button">Ekle</button>
                            <button
                                type="button"
                                className="kategori-close-button"
                                onClick={() => setShowAddForm(false)}
                            >
                                Kapat
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Güncelleme Formu */}
            {showUpdateForm && (
                <div className="kategori-update-modal">
                    <div className="kategori-update-content">
                        <h2>Kategori Güncelle</h2>
                        <form onSubmit={handleUpdateKategoriSubmit}>
                            <label>Kategori Adı:</label>
                            <input
                                type="text"
                                name="kategoriAdi"
                                value={formData.kategoriAdi}
                                onChange={handleInputChange}
                            />
                            <button type="submit" className="kategori-update-submit-button">Güncelle</button>
                            <button
                                type="button"
                                className="kategori-close-button"
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
                <div className="kategori-delete-confirm-modal">
                    <div className="kategori-delete-confirm-content">
                        <h2>Silmek İstediğinizden Emin Misiniz?</h2>
                        <button className="kategori-delete-confirm-button" onClick={handleDeleteConfirm}>Evet, Sil</button>
                        <button className="kategori-delete-cancel-button" onClick={() => setShowDeleteConfirm(false)}>Hayır, Vazgeç</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KategoriIslemleri;
