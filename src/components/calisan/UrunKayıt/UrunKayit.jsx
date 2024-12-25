/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUrunler, fetchKonumlar, addUrun } from "../../../redux/urunSlice";
import { fetchKategoriler } from "../../../redux/kategoriSlice";
import "./UrunKayit.css";

function UrunKayit() {
    const dispatch = useDispatch();
    const { urunler, konumlar, status, error } = useSelector((state) => state.urun);
    const { kategoriler } = useSelector((state) => state.kategori);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        adi: "",
        kartNumarasi: "",
        konumID: "",
        kategoriID: "",
        stokMiktari: 0,
        kayıtTarihi: new Date().toISOString(),
    });
    const [errors, setErrors] = useState({});
    const [rfidListening, setRfidListening] = useState(false);

    useEffect(() => {
        dispatch(fetchUrunler());
        dispatch(fetchKategoriler());
        dispatch(fetchKonumlar());

        // Verileri kontrol etmek için loglama yapın
        console.log("Konumlar:", konumlar);
        console.log("Kategoriler:", kategoriler);
    }, [dispatch]);


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setRfidListening(false);
        setFormData({
            adi: "",
            kartNumarasi: "",
            konumID: "",
            kategoriID: "",
            stokMiktari: 0,
            kayıtTarihi: new Date().toISOString(),
        });
        setErrors({}); // Clear errors on close
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = () => {
        let validationErrors = {};

        if (!formData.adi) {
            validationErrors.adi = "Ürün adı boş olamaz!";
        }

        if (!formData.konumID) {
            validationErrors.konumID = "Konum seçiniz!";
        }

        if (!formData.kategoriID) {
            validationErrors.kategoriID = "Kategori seçiniz!";
        }

        if (!formData.kartNumarasi) {
            validationErrors.kartNumarasi = "RFID zorunludur!";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Prevent form submission if there are errors
        }

        const kartNumarasiVarMi = urunler.some(
            (urun) => urun.kartNumarasi === formData.kartNumarasi
        );

        if (kartNumarasiVarMi) {
            setErrors({ kartNumarasi: "Bu kart numarası zaten kayıtlı!" });
            return;
        }

        // dispatch(addUrun(formData)).then(() => {
        //     dispatch(fetchUrunler());
        //     alert("Ürün başarıyla kaydedildi!"); // Fetch updated list of products after adding a new one
        // });
        dispatch(addUrun(formData));
        dispatch(fetchUrunler());
        alert("Ürün başarıyla kaydedildi!");
        closeModal();
        window.location.reload();

    };

    const handleRfidFocus = () => {
        setRfidListening(true);
        window.addEventListener("keydown", handleRfidReading);
    };

    const handleRfidReading = (event) => {
        if (event.key === "Enter") {
            // Stop reading when 'Enter' is pressed
            window.removeEventListener("keydown", handleRfidReading);
            setRfidListening(false);
        } else {
            // Only append alphanumeric characters to the RFID card value
            setFormData((prev) => ({
                ...prev,
                kartNumarasi: prev.kartNumarasi + event.key,
            }));
        }
    };

    return (
        <div className="urun2-table-container">
            <button className="urun2-urun-search-btn" onClick={openModal}>
                Yeni Ürün Oluştur
            </button>

            {isModalOpen && (
                <div className="urun2-urun-modal-overlay" onClick={closeModal}>
                    <div className="urun2-urun-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="urun2-urun-close-btn" onClick={closeModal}>X</button>
                        <h2>Yeni Ürün Oluştur</h2>
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
                            {errors.kartNumarasi && <p className="error-message">{errors.kartNumarasi}</p>} {/* Error message */}

                            <label>
                                Ürün Adı:
                                <input
                                    type="text"
                                    name="adi"
                                    value={formData.adi}
                                    onChange={handleChange}
                                />
                            </label>
                            {errors.adi && <p className="error-message">{errors.adi}</p>} {/* Error message */}



                            <label>
                                Konum:
                                <select
                                    name="konumID"
                                    value={formData.konumID}
                                    onChange={handleChange}
                                >
                                    <option value="">Seçiniz</option>
                                    {konumlar.map((konum) => (
                                        <option key={konum.konumId} value={konum.konumId}>
                                            {`${konum.blokAdi} - ${konum.rafAdi} - ${konum.bolmeAdi}`}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {errors.konumID && <p className="error-message">{errors.konumID}</p>} {/* Error message */}

                            <label>
                                Kategori:
                                <select
                                    name="kategoriID"
                                    value={formData.kategoriID}
                                    onChange={handleChange}
                                >
                                    <option value="">Seçiniz</option>
                                    {kategoriler.map((kategori) => (
                                        <option key={kategori.kategoriId} value={kategori.kategoriId}>
                                            {kategori.kategoriAdi}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {errors.kategoriID && <p className="error-message">{errors.kategoriID}</p>} {/* Error message */}

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
        </div>
    );
}

export default UrunKayit;
