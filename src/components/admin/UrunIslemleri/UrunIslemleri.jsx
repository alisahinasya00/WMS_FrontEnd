/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUrunler, fetchKonumlar, deleteUrun } from "../../../redux/urunSlice"; // Redux aksiyonlarını içe aktarıyoruz.
import "./UrunIslemleri.css"; // Stilleri için ayrı bir dosya ekliyoruz.

const UrunIslemleri = () => {
    const dispatch = useDispatch();
    const { urunler, konumlar, status, error } = useSelector((state) => state.urun);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUrun, setSelectedUrun] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchUrunler());
            dispatch(fetchKonumlar());
        }
    }, [status, dispatch]);

    useEffect(() => {
        console.log("Konumlar:", konumlar);  // Konum verilerini kontrol edelim.
        console.log("Ürünler:", urunler);    // Ürün verilerini kontrol edelim.
    }, [konumlar, urunler]);

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

    // Silme işlemi için açılacak onay modal'ını açma
    const openDeleteModal = (urun) => {
        setSelectedUrun(urun);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUrun(null);
    };

    // Silme işlemi
    const handleDelete = (urunId) => {
        dispatch(deleteUrun(urunId));
        closeDeleteModal(); // Modalı kapatıyoruz
    };

    return (
        <div className="table-container">
            {/* Başlık ve Yeni Ürün Ekle Butonu */}
            <h1>Ürünler</h1>


            <table className="urun-table">
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
                                <div className="button-group">
                                    <button className="btn btn-detail" onClick={() => openModal(urun)}>Detay</button>
                                    <button className="btn btn-delete" onClick={() => openDeleteModal(urun)}>Sil</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Bileşeni */}
            {isModalOpen && selectedUrun && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>X</button>
                        <h2>{selectedUrun.adi}</h2>
                        <p><strong>Kategori:</strong> {selectedUrun.kategoriAdi}</p>
                        <p><strong>Stok Miktarı:</strong> {selectedUrun.stokMiktari}</p>
                        <p><strong>Konum:</strong> {getKonumBilgisi(selectedUrun.konumID)}</p>
                        <p><strong>Kayıt Tarihi:</strong> {new Date(selectedUrun.kayıtTarihi).toLocaleDateString()}</p>
                        {/* Diğer ürün detayları burada gösterilebilir */}
                    </div>
                </div>
            )}

            {/* Silme Onay Modal'ı */}
            {isDeleteModalOpen && selectedUrun && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeDeleteModal}>X</button>
                        <h2>Ürünü Sil</h2>
                        <p>{selectedUrun.adi} adlı ürünü silmek istediğinizden emin misiniz?</p>
                        <div className="modal-buttons">
                            <button className="btn btn-confirm" onClick={() => handleDelete(selectedUrun.urunId)}>Evet, Sil</button>
                            <button className="btn btn-cancel" onClick={closeDeleteModal}>Hayır, Vazgeç</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UrunIslemleri;
