// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGirisIslemler, fetchCikisIslemler, fetchIadeIslemler } from '../../../redux/siparisSlice';
import { fetchFabrikalar } from '../../../redux/fabrikaSlice';
import { fetchMagazalar } from '../../../redux/magazaSlice';
import './SiparisIslemleri.css';

const SiparisIslemleri = () => {
  const dispatch = useDispatch();
  const girisIslemler = useSelector((state) => state.siparis.girisIslemler);
  const cikisIslemler = useSelector((state) => state.siparis.cikisIslemler);
  const iadeIslemler = useSelector((state) => state.siparis.iadeIslemler);
  const fabrikalar = useSelector((state) => state.fabrika.fabrikalar);
  const siparisStatus = useSelector((state) => state.siparis.status);
  const siparisError = useSelector((state) => state.siparis.error);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (selectedOperation === 'Giris') {
      dispatch(fetchGirisIslemler());
    } else if (selectedOperation === 'Cikis') {
      dispatch(fetchCikisIslemler());
    } else if (selectedOperation === 'Iade') {
      dispatch(fetchIadeIslemler());
    }
  }, [dispatch, selectedOperation]);
  useEffect(() => {
    dispatch(fetchFabrikalar());
    dispatch(fetchMagazalar());
  }, [dispatch]);

  if (siparisStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (siparisStatus === 'failed') {
    return <div>Error: {siparisError}</div>;
  }

  // Dinamik tablo verisi
  const getTableData = () => {
    switch (selectedOperation) {
      case 'Giris':
        return girisIslemler;
      case 'Cikis':
        return cikisIslemler;
      case 'Iade':
        return iadeIslemler;
      default:
        return [];
    }
  };

  const handleDetails = (islem) => {
    console.log(fabrikalar)
    if (selectedOperation === 'Giris') {
      // fabrikaID'yi al ve fabrikalar listesinde eşleşen adresi bul
      const fabrika = fabrikalar.find((f) => f.fabrikaId === islem.fabrikaID);
      setDetailData({
        fabrikaAdi: fabrika ? fabrika.adres : 'Bilinmiyor', // Eğer fabrika bulunamazsa 'Bilinmiyor' yazacak
      });
    } else {
      // Diğer işlemler için mağaza adı gibi bilgiler eklenebilir
      setDetailData({
        magazaAdi: islem.magazaAdi,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailData(null);
  };


  return (
    <div>
      <h1>İşlem Listesi</h1>

      {/* İşlem türü butonları */}
      <div className="siparis-operation-buttons">
        <button onClick={() => setSelectedOperation('Giris')}>Giriş İşlemleri</button>
        <button onClick={() => setSelectedOperation('Cikis')}>Çıkış İşlemleri</button>
        <button onClick={() => setSelectedOperation('Iade')}>İade İşlemleri</button>
      </div>

      {/* Tablo */}
      <table>
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Çalışan Adı</th>
            <th>Ürün Adedi</th>
            <th>İşlem Tarihi</th>
            <th>Durum</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {getTableData().map((islem) => (
            <tr key={islem.id}>
              <td>{islem.urunAdi}</td>
              <td>{islem.calisanAdi}</td>
              <td>{islem.urunAdedi}</td>
              <td>{islem.islemTarihi}</td>
              <td>{islem.durum}</td>
              <td>
                <button className="siparis-details-button" onClick={() => handleDetails(islem)}>Detay</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detay Modali */}
      {isModalOpen && detailData && (
        <div className="siparis-detail-modal">
          <div className="siparis-detail-content">
            <div className="siparis-modal-header">
              <h2>Detaylar</h2>
            </div>
            <div className="siparis-detail-info">
              {detailData.magazaAdi && (
                <p><strong>Mağaza Adı:</strong> {detailData.magazaAdi}</p>
              )}
              {detailData.fabrikaAdi && (
                <p><strong>Fabrika Adı:</strong> {detailData.fabrikaAdi}</p>
              )}
              <button className="siparis-close-button" onClick={closeModal}> Kapat </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiparisIslemleri;
