/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalisanlar, deleteCalisan, updateCalisan, addCalisan } from '../../../redux/calisanSlice';
import './CalisanIslemleri.css';

const CalisanIslemleri = () => {

    const roles = [
        { rolId: 2, rolAdi: 'Çalışan' },
        { rolId: 1, rolAdi: 'Yönetici' }
    ];

    const dispatch = useDispatch();
    const { calisanlar, status, error } = useSelector((state) => state.calisan);
    const [selectedCalisan, setSelectedCalisan] = useState(null); // Detay gösterimi için durum
    const [showUpdateForm, setShowUpdateForm] = useState(false); // Güncelleme formu gösterimi için durum
    const [formData, setFormData] = useState({}); // Güncelleme formu verisi
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Silme onayı durumu
    const [deleteId, setDeleteId] = useState(null); // Silinecek çalışan ID'si
    const [showAddForm, setShowAddForm] = useState(false);

    const formatTodayDate = (date) => {
        const today = new Date(date);
        return today.toISOString().split('T')[0]; // Bugünün tarihi 'yyyy-MM-dd' formatında
    };

    const [newCalisan, setNewCalisan] = useState(
        {
            adi: '',
            soyadi: '',
            maas: '',
            telefonNo: '',
            adres: '',
            mail: '',
            sifre: '',
            iseGirisTarihi: formatTodayDate(new Date()),
            rolId: ''
        });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalisanlar());
        }
    }, [dispatch, status]);

    const handleDetail = (calisan) => {
        setSelectedCalisan(calisan);
        const rol = roles.find(role => role.rolAdi === calisan.rolAdi);
        setFormData({
            ...calisan,
            rolId: rol ? rol.rolId : undefined, // Eğer rol bulunamazsa, rolId undefined olur
        });
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
        console.log(formData)
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
        const updatedData = {
            ...formData,
            // Burada 'rolAdi' yerine 'rolId' değerini göndereceğiz.
            rolId: formData.rolId
        };
        console.log(updatedData)
        dispatch(updateCalisan({ updatedData }))
            .then(() => {
                setShowUpdateForm(false);
                dispatch(fetchCalisanlar());
            })
            .catch((error) => {
                // Hata işleme
            });
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setNewCalisan((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddCalisanSubmit = (e) => {
        e.preventDefault();
        console.log(newCalisan)
        dispatch(addCalisan(newCalisan))
            .then(() => {
                setShowAddForm(false);
                setNewCalisan({
                    adi: '',
                    soyadi: '',
                    maas: '',
                    telefonNo: '',
                    adres: '',
                    mail: '',
                    sifre: '',
                    iseGirisTarihi: formatTodayDate(),
                    rolId: ''
                })
                dispatch(fetchCalisanlar());
            })
            .catch((error) => {
                //setErrorMessage("Fabrika eklenirken bir hata oluştu.");
            });
        { console.log(formData) }
    };

    const handleAddCalisanClick = () => {
        setShowAddForm(true); // Yeni fabrika ekleme formunu göster

    };

    if (status === 'loading') return <div className="status">Loading...</div>;
    if (status === 'failed') return <div className="status">Error: {error}</div>;

    return (
        <div className="calisan-container">
            <h1>Çalışanlar</h1>
            <button className="calisan-update-button" onClick={handleAddCalisanClick}>Yeni Çalışan Ekle</button>
            <ul className="calisan-list">
                {calisanlar.map((calisan) => (
                    <li key={calisan.calisanId} className="calisan-card">
                        <div className="calisan-info">
                            <strong>{calisan.adi} {calisan.soyadi}</strong>
                        </div>
                        <div className="calisan-actions">
                            <button className="calisan-detail-button" onClick={() => handleDetail(calisan)}>Detay</button>
                            <button className="calisan-update-button" onClick={() => handleUpdate(calisan.calisanId)}>Güncelle</button>
                            <button className="calisan-delete-button" onClick={() => handleDelete(calisan.calisanId)}>Sil</button>
                        </div>
                    </li>
                ))}
            </ul>


            {/* Yeni çalışan Ekleme Formu */}
            {showAddForm && (
                <div className="calisan-update-modal">
                    <div className="calisan-update-content">
                        <h2>Yeni Çalışan Ekle</h2>
                        <form onSubmit={handleAddCalisanSubmit}>
                            <label>Adı:</label>
                            <input
                                type="text"
                                name="adi"
                                value={newCalisan.adi}
                                onChange={handleAddFormChange}
                            />
                            <label>Soyadı:</label>
                            <input
                                type="text"
                                name="soyadi"
                                value={newCalisan.soyadi}
                                onChange={handleAddFormChange}
                            />
                            <label>Maaş:</label>
                            <input
                                type="number"
                                name="maas"
                                value={newCalisan.maas}
                                onChange={handleAddFormChange}
                            />
                            <label>Telefon No:</label>
                            <input
                                type="text"
                                name="telefonNo"
                                value={newCalisan.telefonNo}
                                onChange={handleAddFormChange}
                            />
                            <label>Adres:</label>
                            <input
                                type="text"
                                name="adres"
                                value={newCalisan.adres}
                                onChange={handleAddFormChange}
                            />
                            <label>Mail:</label>
                            <input
                                type="email"
                                name="mail"
                                value={newCalisan.mail}
                                onChange={handleAddFormChange}
                            />
                            <label>Şifre:</label>
                            <input
                                type="text"
                                name="sifre"
                                value={newCalisan.sifre}
                                onChange={handleAddFormChange}
                            />
                            <label>İşe giriş tarihi:</label>
                            <input
                                type="date"
                                name="iseGirisTarihi"
                                value={newCalisan.iseGirisTarihi}
                                onChange={handleAddFormChange}
                            />
                            <label>Rol:</label>
                            <div className='radio-group'>
                                <input
                                    type="radio"
                                    name="rolId"
                                    value="1" // Yönetici rolü için 1
                                    onChange={handleAddFormChange}
                                />
                                Yönetici
                                <input
                                    type="radio"
                                    name="rolId"
                                    value="2" // Çalışan rolü için 2
                                    onChange={handleAddFormChange}
                                />
                                Çalışan
                            </div>
                            <button type="submit" className="calisan-update-submit-button">Ekle</button>

                            <button
                                type="button"
                                className="calisan-close-button"
                                onClick={() => setShowAddForm(false)
                                }
                            >
                                Kapat
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detay Modali */}
            {selectedCalisan && (
                <div className="calisan-detail-modal">
                    <div className="calisan-detail-content">
                        <h2>Çalışan Detayları</h2>
                        <p><strong>Ad Soyad:</strong> {selectedCalisan.adi} {selectedCalisan.soyadi}</p>
                        <p><strong>Rol:</strong> {selectedCalisan.rolAdi}</p>
                        <p><strong>Mail:</strong> {selectedCalisan.mail}</p>
                        <p><strong>Telefon:</strong> {selectedCalisan.telefonNo}</p>
                        <p><strong>Adres:</strong> {selectedCalisan.adres}</p>
                        <p><strong>Maaş:</strong> {selectedCalisan.maas}₺</p>
                        <p><strong>İşe Giriş Tarihi:</strong> {new Date(selectedCalisan.iseGirisTarihi).toLocaleDateString()}</p>
                        <p><strong>Şifre:</strong> {selectedCalisan.sifre}₺</p>
                        <button className="calisan-close-button" onClick={handleCloseDetail}>Kapat</button>
                    </div>
                </div>
            )}

            {/* Güncelleme Formu */}
            {showUpdateForm && (
                <div className="calisan-update-modal">
                    <div className="calisan-update-content">
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
                            <label style={{ display: "none" }} >İşe Giriş Tarihi:</label>
                            <input
                                type="text"
                                name="iseGirisTarihi"
                                value={new Date(formData.iseGirisTarihi).toLocaleDateString()}
                                onChange={handleInputChange}
                                style={{ display: "none" }}
                            />
                            <label>Mevcut Rol: {formData.rolAdi} </label>
                            <select
                                name="rolId"
                                value={formData.rolId || ''}
                                onChange={handleInputChange}
                            >
                                {roles.map((role) => (
                                    <option key={role.rolId} value={role.rolId}>
                                        {role.rolAdi}
                                    </option>
                                ))}
                            </select>

                            <label>Şifre:</label>
                            <input
                                type="text"
                                name="sifre"
                                value={formData.sifre}
                                onChange={handleInputChange}
                            />
                            <button type="submit" className="calisan-update-submit-button">Güncelle</button>
                            <button
                                type="button"
                                className="calisan-close-button"
                                onClick={() => setShowUpdateForm(false)}
                            >
                                Kapat
                            </button>
                        </form>
                    </div>
                </div>
            )
            }

            {/* Silme Onayı */}
            {
                showDeleteConfirm && (
                    <div className="calisan-delete-confirm-modal">
                        <div className="calisan-delete-confirm-content">
                            <h2>Silmek İstediğinizden Emin Misiniz?</h2>
                            <button className="calisan-delete-confirm-button" onClick={handleDeleteConfirm}>Evet, Sil</button>
                            <button className="calisan-delete-cancel-button" onClick={handleDeleteCancel}>Hayır, Vazgeç</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default CalisanIslemleri;