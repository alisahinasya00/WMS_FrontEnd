/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUrunler, fetchKonumlar } from "../../../redux/urunSlice"; // Redux aksiyonlarını içe aktarıyoruz.
import "./UrunIslemleri.css";

const UrunIslemleri = () => {
    const dispatch = useDispatch();
    const { urunler, konumlar, status, error } = useSelector((state) => state.urun);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUrun, setSelectedUrun] = useState(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [rfidCard, setRfidCard] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [rfidError, setRfidError] = useState(""); // Hata mesajı için state


    const openSearchModal = () => {
        setIsSearchModalOpen(true);
        setIsListening(true); // RFID girişlerini dinlemeye başla
        setRfidCard(""); // Kart numarasını sıfırla
        setRfidError(""); // Hata mesajını sıfırla

    };

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
        setIsListening(false); // RFID girişlerini durdur
        setRfidCard("");
        setRfidError(""); // Hata mesajını sıfırla

    };

    useEffect(() => {
        setIsSearchModalOpen(false);
        if (!isListening) {
            return;
        }
        const handleKeyDown = (event) => {
            setIsSearchModalOpen(false);
            if (event.key === "Enter") {
                setIsSearchModalOpen(false);
                const urun = urunler.find((u) => u.kartNumarasi === rfidCard.trim());
                if (urun) {
                    setIsSearchModalOpen(false);
                    setSelectedUrun(urun);
                    setIsModalOpen(true);
                }
                else {
                    setIsSearchModalOpen(false);
                    alert("Bu karta ait ürün bulunamadı.");
                }
                setIsListening(false);
            } else {
                setRfidCard((prev) => prev + event.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isListening, rfidCard, urunler]);


    useEffect(() => {
        dispatch(fetchUrunler());
        dispatch(fetchKonumlar());
    }, [dispatch]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "failed") {
        return <div>Error: {error}</div>;
    }

    const getKonumBilgisi = (konumId) => {
        const konum = konumlar.find((k) => k.konumId === konumId);
        if (konum) {
            return `${konum.blokAdi} - ${konum.rafAdi} - ${konum.bolmeAdi}`;
        }
        return "Bilinmiyor";
    };

    const openModal = (urun) => {
        setSelectedUrun(urun);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUrun(null);
    };

    return (
        <div className="urun1-table-container">
            <h1>Ürünler</h1>
            <button className="urun1-urun-search-btn" onClick={openSearchModal}>
                Ürün Ara
            </button>
            <table className="urun1-urun-table">
                <thead>
                    <tr>
                        <th>Adı</th>
                        <th>Kategori</th>
                        <th>Stok Miktarı</th>
                        <th>Konum (Blok - Raf - Bölme)</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {urunler.map((urun) => (
                        <tr key={urun.urunId}>
                            <td>{urun.adi}</td>
                            <td>{urun.kategoriAdi}</td>
                            <td>{urun.stokMiktari}</td>
                            <td>{getKonumBilgisi(urun.konumID)}</td>
                            <td>
                                <div className="urun1-urun-button-group">
                                    <button className="urun1-urun-btn urun1-urun-btn-detail" onClick={() => openModal(urun)}>Detay</button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Bileşeni */}
            {isModalOpen && selectedUrun && (
                <div className="urun1-urun-modal-overlay" onClick={closeModal}>
                    <div className="urun1-urun-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="urun1-urun-close-btn" onClick={closeModal}>X</button>
                        <h2>{selectedUrun.adi}</h2>
                        <p><strong>Kategori:</strong> {selectedUrun.kategoriAdi}</p>
                        <p><strong>Stok Miktarı:</strong> {selectedUrun.stokMiktari}</p>
                        <p><strong>Konum:</strong> {getKonumBilgisi(selectedUrun.konumID)}</p>
                        <p><strong>Kayıt Tarihi:</strong> {new Date(selectedUrun.kayıtTarihi).toLocaleDateString()}</p>
                        {/* Diğer ürün detayları burada gösterilebilir */}
                    </div>
                </div>
            )}

            {/* RFID Arama Modal */}
            {isSearchModalOpen && (
                <div className="urun1-urun-modal-overlay" onClick={closeSearchModal}>
                    <div className="urun1-urun-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="urun1-urun-close-btn" onClick={closeSearchModal}>X</button>
                        <h2>Kartı Okutun</h2>
                    </div>
                </div>
            )}

        </div>
    )
}

export default UrunIslemleri
