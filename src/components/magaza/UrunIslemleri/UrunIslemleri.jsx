/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUrunler } from '../../../redux/urunSlice';
import { fetchMagazalar } from '../../../redux/magazaSlice';
import { fetchCikisIslemler, fetchIadeIslemler, addCikisIslem, addIadeIslem, deleteCikisIslem } from '../../../redux/siparisSlice';
import './UrunIslemleri.css';

function UrunIslemleri() {   //mağaza işlemleri sayfası
  const dispatch = useDispatch();

  // Redux store'dan mağaza ve sipariş verilerini al
  const magazalar = useSelector((state) => state.magaza.magazalar);
  const urunler = useSelector((state) => state.urun.urunler);
  const cikisIslemler = useSelector((state) => state.siparis.cikisIslemler);
  const iadeIslemler = useSelector((state) => state.siparis.iadeIslemler);

  // Giriş yapılan mağazanın bilgisi
  const magazaMail = localStorage.getItem('magazaMail');
  const magaza = magazalar.find((magaza) => magaza.mail === magazaMail);

  // Sipariş formu için state'ler
  const [siparisFormuGoster, setSiparisFormuGoster] = useState(false);
  const [seciliUrun, setSeciliUrun] = useState('');
  const [adet, setAdet] = useState(1);
  const [stokYetersiz, setStokYetersiz] = useState(false);

  // Bileşen yüklendiğinde ürünleri al
  useEffect(() => {
    dispatch(fetchUrunler());
    dispatch(fetchMagazalar());
    dispatch(fetchCikisIslemler());
    dispatch(fetchIadeIslemler());
  }, [dispatch]);

  // Stok kontrolü
  const kontrolEtStok = () => {
    const secilenUrun = urunler.find((urun) => urun.adi === seciliUrun);
    if (secilenUrun && adet > secilenUrun.stokMiktari) {
      setStokYetersiz(true);
      return false;
    }
    setStokYetersiz(false);
    return true;
  };

  // Sipariş ekleme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kontrolEtStok()) return;

    const secilenUrun = urunler.find((urun) => urun.adi === seciliUrun);
    const yeniSiparis = {
      urunID: secilenUrun.urunId,
      urunAdedi: adet,
      calisanID: 2,
      islemTurID: 3,
      magazaID: magaza.magazaId,
      islemTarihi: new Date().toISOString(),
      durum: 'Bekliyor',
    };
    console.log('Yeni Sipariş', yeniSiparis);
    dispatch(addCikisIslem(yeniSiparis));
    dispatch(fetchUrunler());
    dispatch(fetchCikisIslemler());
    setSiparisFormuGoster(false);
  };

  // Mağaza ID'sine göre filtrelenen işlemler
  const getFilteredOperations = () => {
    if (!magaza) return [];
    const magazaAdi = magaza.magazaAdi;

    const cikisFiltered = cikisIslemler.filter((islem) => islem.magazaAdi === magazaAdi);
    const iadeFiltered = iadeIslemler.filter((islem) => islem.magazaAdi === magazaAdi);

    return [...cikisFiltered, ...iadeFiltered];
  };

  // İade işlemi
  const handleIade = (cikisIslemId) => {
    const islem = cikisIslemler.find((islem) => islem.cikisIslemId === cikisIslemId);
    const urun = urunler.find((urun) => urun.adi === islem.urunAdi);
    //console.log("ıd",islem.cikisIslemId);
    if (!islem) {
      alert('İlgili işlem bulunamadı.');
      return;
    }
    if (islem.durum === 'Onaylandı') {
      const updatedData = {
        urunId: urun.urunId,
        urunAdedi: islem.urunAdedi,
        calisanId: 2,
        magazaId: magaza.magazaId,
        islemTarihi: new Date().toISOString(),
        durum: 'Bekliyor',
        islemTurId: 2,
      };
      console.log('seciliUrun:', islem.urunAdi);
      console.log("güncellenen ürün", updatedData);
      dispatch(addIadeIslem(updatedData));
      dispatch(deleteCikisIslem(cikisIslemId));
      dispatch(fetchCikisIslemler());
      dispatch(fetchIadeIslemler());
      dispatch(fetchUrunler());
    } else {
      alert(`Bu işlem iade edilemez. Durum: ${islem.durum}`);
    }
  };

  return (
    <div>
      <button className="magaza_siparis_button" onClick={() => setSiparisFormuGoster(true)}>Yeni Sipariş Ekle</button>

      {siparisFormuGoster && (
        <div className="magaza_siparis_order-form">
          <h2>Yeni Sipariş</h2>
          <form className="magaza_siparis_form" onSubmit={handleSubmit}>
            <div>
              <label className="magaza_siparis_label">Ürün:</label>
              <select
                className="magaza_siparis_select"
                value={seciliUrun}
                onChange={(e) => setSeciliUrun(e.target.value)}
                required
              >
                <option value="">Ürün Seçin</option>
                {urunler.length > 0 ? (
                  urunler.map((urun) => (
                    <option key={urun.urunId} value={urun.adi}>{urun.adi}</option>
                  ))
                ) : (
                  <option disabled>Ürünler Yükleniyor...</option>
                )}
              </select>
            </div>

            <div>
              <label className="magaza_siparis_label">Adet:</label>
              <input
                className="magaza_siparis_input"
                type="number"
                value={adet}
                onChange={(e) => setAdet(e.target.value)}
                min="1"
                required
              />
            </div>

            {stokYetersiz && (
              <div className="stok-uuyari">
                Stok yetersiz! Mevcut stok miktarı: {urunler.find((urun) => urun.adi === seciliUrun)?.stokMiktari}
              </div>
            )}

            <button className="magaza_siparis_submit-button" type="submit">Siparişi Ekle</button>
            <button className="magaza_siparis_cancel-button" type="button" onClick={() => setSiparisFormuGoster(false)}>İptal</button>
          </form>
        </div>
      )}

      <h2 className="magaza_siparisler-baslik">Siparişler</h2>
      <table className="magaza_siparis_table">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Ürün Adedi</th>
            <th>İşlem Tarihi</th>
            <th>Durum</th>
            <th>İşlem Türü</th>
            <th>İade Et</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredOperations().map((islem) => (
            <tr key={islem.cikisIslemId}>
              <td>{islem.urunAdi}</td>
              <td>{islem.urunAdedi}</td>
              <td>{new Date(islem.islemTarihi).toLocaleDateString('tr-TR')}</td>
              <td>{islem.durum}</td>
              <td>{islem.islemAdi}</td>
              <td>
                {islem.durum === 'Onaylandı' && islem.islemAdi === "Çıkış" ? (
                  <button onClick={() => handleIade(islem.cikisIslemId)}>İade Et</button>
                ) : (
                  <button disabled>İade Edilemez</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrunIslemleri;
