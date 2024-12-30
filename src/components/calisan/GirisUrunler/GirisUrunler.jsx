/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGirisIslemler, addGirisIslem } from '../../../redux/siparisSlice';
import { fetchUrunler } from '../../../redux/urunSlice';
import { fetchCalisanlar } from '../../../redux/calisanSlice';
import { fetchFabrikalar } from '../../../redux/fabrikaSlice';

const GirisUrunler = () => {
    const dispatch = useDispatch();
    const calisanlar = useSelector((state) => state.calisan.calisanlar);
    const fabrikalar = useSelector((state) => state.fabrika.fabrikalar);
    const urunler = useSelector((state) => state.urun.urunler);
    const girisIslemler = useSelector((state) => state.siparis.girisIslemler);
    const calisanMail = localStorage.getItem('userMail');
    const mevcutCalisan = calisanlar.find((calisan) => calisan.mail === calisanMail);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        urunID: 0,
        islemTurID: 1,
        durum: "Onaylandı",
        fabrikaID: 0,
        calisanID: 0,
        urunAdedi: 0,
        islemTarihi: new Date().toISOString(),
        kartNumarasi: "",
    });
    const [errors, setErrors] = useState({});
    const [rfidListening, setRfidListening] = useState(false);

    useEffect(() => {
        dispatch(fetchGirisIslemler());
        dispatch(fetchFabrikalar());
        dispatch(fetchUrunler());
        dispatch(fetchCalisanlar());
    }, [dispatch]);

    if (!mevcutCalisan) {
        return <div>Giriş yapılan çalışanın bilgileri bulunamadı.</div>;
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            urunID: 0,
            islemTurID: 1,
            durum: "Onaylandı",
            fabrikaID: 0,
            calisanID: 0,
            urunAdedi: 0,
            islemTarihi: new Date().toISOString(),
            kartNumarasi: ""
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "fabrikaID") {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
        } else if (name === "urunAdedi") {
            setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCreate = () => {
        let validationErrors = {};
        if (!formData.fabrikaID) {
            validationErrors.fabrikaID = "Fabrika seçiniz!";
        }
        if (!formData.kartNumarasi) {
            validationErrors.kartNumarasi = "RFID zorunludur!";
        }
        if (!formData.urunAdedi) {
            validationErrors.urunAdedi = "Ürün adedi boş olamaz";
        }
        if (formData.urunAdedi <= 0) {
            validationErrors.urunAdedi = "Ürün adedi 0'dan büyük olmalı";
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Prevent form submission if there are errors
        }
        const urun = urunler.find((urun) => urun.kartNumarasi === formData.kartNumarasi);
        if (!urun) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                kartNumarasi: "Kart numarası ile eşleşen ürün bulunamadı! Lütfen önce ürün kaydı yapın",
            }));
            return;
        }
        const newIslem = {
            urunID: urun.urunId, // Use the ID from the matched product
            islemTurID: 1, // Fixed value
            durum: "Onaylandı", // Fixed value
            fabrikaID: formData.fabrikaID,
            calisanID: mevcutCalisan.calisanId,
            urunAdedi: formData.urunAdedi,
            islemTarihi: new Date().toISOString(),
        };
        console.log(newIslem);
        dispatch(addGirisIslem(newIslem));
        dispatch(fetchGirisIslemler())
        closeModal();
    };

    const handleRfidFocus = () => {
        setRfidListening(true);
        window.addEventListener("keydown", handleRfidReading);
    };

    const handleRfidReading = (event) => {
        if (event.key === "Enter") {
            window.removeEventListener("keydown", handleRfidReading);
            setRfidListening(false);
        } else {
            setFormData((prev) => ({
                ...prev,
                kartNumarasi: prev.kartNumarasi + event.key,
            }));
        }
    };

    return (
        <div className="urun2-table-container">
            <h1 className="calisan_siparisler-baslik">Ürün Giriş İşlemleri</h1>
            <button className="urun2-urun-search-btn" onClick={openModal}>
                Ürün Girişi
            </button>
            {isModalOpen && (
                <div className="urun2-urun-modal-overlay" onClick={closeModal}>
                    <div className="urun2-urun-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="urun2-urun-close-btn" onClick={closeModal}>X</button>
                        <h2>Ürün Girişi</h2>
                        <form>
                            <label>
                                Kart Numarası (RFID ile okutun):
                                <input
                                    type="text"
                                    name="kartNumarasi"
                                    value={formData.kartNumarasi}
                                    onFocus={handleRfidFocus} // Start listening when focused
                                    readOnly
                                />
                            </label>
                            {errors.kartNumarasi && <p className="error-message">{errors.kartNumarasi}</p>}

                            <label>
                                Ürün Adedi:
                                <input
                                    type="number"  // Changed to number type for integer input
                                    name="urunAdedi"
                                    value={formData.urunAdedi}
                                    onChange={handleChange}
                                />
                            </label>
                            {errors.urunAdedi && <p className="error-message">{errors.urunAdedi}</p>}

                            <label>
                                Fabrika:
                                <select name='fabrikaID' value={formData.fabrikaID} onChange={handleChange}>
                                    <option value="">Seçiniz</option>
                                    {fabrikalar.map((fabrika) => (
                                        <option key={fabrika.fabrikaId} value={fabrika.fabrikaId}> {fabrika.adres} </option>
                                    ))}
                                </select>
                            </label>
                            {errors.fabrikaID && <p className="error-message">{errors.fabrikaID}</p>}

                            <button
                                type="button"
                                className="urun2-urun-add-btn"
                                onClick={handleCreate}
                            >
                                Kaydet
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Ürün Adedi</th>
                        <th>İşlem Tarihi</th>
                    </tr>
                </thead>
                <tbody>
                    {girisIslemler.map((islem) => (
                        <tr key={islem.girisIslemId}>
                            <td>{islem.urunAdi}</td>
                            <td>{islem.urunAdedi}</td>
                            <td>{new Date(islem.islemTarihi).toLocaleDateString('tr-TR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GirisUrunler;
