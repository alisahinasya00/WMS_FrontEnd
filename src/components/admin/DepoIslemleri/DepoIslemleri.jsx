/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteRaf,
    deleteBlok,
    deleteBolme,
    fetchBloklar,
    fetchRaflar,
    fetchBolmeler,
    addBolme,
    addRaf,
    addBlok, // Yeni eklenen addBlok fonksiyonu
} from '../../../redux/depoSlice';
import { Card, CardContent, Typography, Button, Modal, Box, TextField } from '@mui/material';

// Modal'ın stil ayarları
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DepoIslemleri = () => {
    const dispatch = useDispatch();
    const bloklar = useSelector((state) => state.depo.bloklar);
    const raflar = useSelector((state) => state.depo.raflar);
    const bolmeler = useSelector((state) => state.depo.bolmeler);
    const [selectedBlok, setSelectedBlok] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRafAdi, setNewRafAdi] = useState('');
    const [isAddingRaf, setIsAddingRaf] = useState(false);
    const [newBlokAdi, setNewBlokAdi] = useState(''); // Yeni blok adı state'i
    const [isAddingBlok, setIsAddingBlok] = useState(false); // Yeni blok ekleme durumu

    useEffect(() => {
        dispatch(fetchBloklar());
        dispatch(fetchRaflar());
        dispatch(fetchBolmeler());
    }, [dispatch]);

    const handleDelete = (blokId) => {
        dispatch(deleteBlok(blokId));
    };

    const handleDetails = (blok) => {
        setSelectedBlok(blok);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBlok(null);
    };

    const handleBolmeEkle = (raf) => {
        const yeniBolme = {
            blokID: selectedBlok.blokId,
            rafID: raf.rafId,
            bolmeAdi: `Yeni Bölme`,
        };
        dispatch(addBolme(yeniBolme)).then(() => {
            dispatch(fetchBolmeler());
        });
    };

    const handleBolmeCikart = (raf) => {
        // Raf adına ait bölmeleri filtrele
        const rafBolmeleri = bolmeler.filter(
            (bolme) => bolme.blokAdi === selectedBlok?.blokAdi && bolme.rafAdi === raf.rafAdi
        );

        // Eğer bu raf için bölme varsa
        if (rafBolmeleri.length > 0) {
            // Rastgele bir bölme seç
            const randomBolme = rafBolmeleri[Math.floor(Math.random() * rafBolmeleri.length)];

            // Seçilen bölmeyi silmek için deleteBolme fonksiyonuna ID'yi gönder
            dispatch(deleteBolme(randomBolme.bolmeId)).then(() => {
                // Bölme silindikten sonra bolmeleri tekrar fetch et
                dispatch(fetchBolmeler());
            });
        } else {
            // Eğer raf için bölme yoksa, kullanıcıya uyarı göster
            alert("Bu raf için silinecek bir bölme yok.");
        }
    };


    const handleRafSil = (raf) => {
        const rafBolmeleri = bolmeler.filter(
            (bolme) => bolme.blokAdi === selectedBlok?.blokAdi && bolme.rafAdi === raf.rafAdi
        );

        if (rafBolmeleri.length > 0) {
            rafBolmeleri.forEach((bolme) => {
                dispatch(deleteBolme(bolme.bolmeId)).then(() => {
                    dispatch(fetchBolmeler());
                });
            });
        }

        dispatch(deleteRaf(raf.rafId)).then(() => {
            dispatch(fetchRaflar());
        });
    };

    const handleAddRaf = () => {
        if (newRafAdi.trim() === '') {
            alert('Raf adı boş olamaz!');
            return;
        }

        const yeniRaf = {
            blokID: selectedBlok.blokId,
            rafAdi: newRafAdi,
        };

        dispatch(addRaf(yeniRaf)).then(() => {
            dispatch(fetchRaflar());
            setNewRafAdi('');
            setIsAddingRaf(false);
        });
    };

    const handleAddBlok = () => {
        if (newBlokAdi.trim() === '') {
            alert('Blok adı boş olamaz!');
            return;
        }

        const yeniBlok = {
            blokAdi: newBlokAdi,
        };

        dispatch(addBlok(yeniBlok)).then(() => {
            dispatch(fetchBloklar());
            setNewBlokAdi('');
            setIsAddingBlok(false);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', marginTop: '40px', color: 'black' }}>
            {/* Bloklar Başlığı ve Yeni Blok Ekle Butonu */}
            <div >
                <Typography variant="h5" component="h2" style={{ marginBottom: '8px' }}>
                    Bloklar - Raflar - Bölmeler
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddingBlok(true)}
                >
                    Yeni Blok Ekle
                </Button>
            </div>

            {/* Yeni Blok Ekleme Formu */}
            {isAddingBlok && (
                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        label="Yeni Blok Adı"
                        value={newBlokAdi}
                        onChange={(e) => setNewBlokAdi(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddBlok}
                        style={{ marginTop: '8px' }}
                    >
                        Blok Ekle
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsAddingBlok(false)}
                        style={{ marginTop: '8px', marginLeft: '8px' }}
                    >
                        İptal
                    </Button>
                </div>
            )}

            {/* Blok Kartları */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '16px' }}>
                {bloklar.map((blok) => (
                    <Card
                        key={blok.blokId}
                        style={{
                            width: '200px',
                            height: '100px',
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        <CardContent>
                            <Typography variant="h6">{blok.blokAdi}</Typography>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <Button variant="contained" color="primary" size="small" onClick={() => handleDetails(blok)}>
                                    Detay
                                </Button>
                                <Button variant="contained" color="error" size="small" onClick={() => handleDelete(blok.blokId)}>
                                    Sil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            <Modal open={isModalOpen} onClose={closeModal}>
                <Box sx={{ ...modalStyle, maxHeight: '80vh', overflowY: 'auto' }}>
                    <Typography variant="h6" component="h2" style={{ marginBottom: '16px' }}>
                        {selectedBlok?.blokAdi} - Raflar
                    </Typography>
                    {/* Yeni Raf Ekle Butonu */}
                    <div style={{ marginBottom: '16px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsAddingRaf(true)}
                        >
                            Yeni Raf Ekle
                        </Button>
                    </div>
                    {/* Yeni Raf Ekleme Formu */}
                    {isAddingRaf && (
                        <div style={{ marginBottom: '16px' }}>
                            <TextField
                                label="Yeni Raf Adı"
                                value={newRafAdi}
                                onChange={(e) => setNewRafAdi(e.target.value)}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleAddRaf}
                                style={{ marginTop: '8px' }}
                            >
                                Raf Ekle
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setIsAddingRaf(false)}
                                style={{ marginTop: '8px', marginLeft: '8px' }}
                            >
                                İptal
                            </Button>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {raflar
                            .filter((raf) => raf.blokAdi === selectedBlok?.blokAdi)
                            .map((raf) => {
                                const bolmeSayisi = bolmeler.filter(
                                    (bolme) =>
                                        bolme.blokAdi === selectedBlok?.blokAdi &&
                                        bolme.rafAdi === raf.rafAdi
                                ).length;

                                return (
                                    <Card key={raf.rafId}
                                        style={{
                                            width: '150px',
                                            height: '200px',
                                            border: '1px solid #ddd',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '8px',
                                        }}>
                                        <CardContent>
                                            <Typography variant="body1" align='center'>{raf.rafAdi}</Typography>
                                            <Typography
                                                variant="body2"
                                                align="center"
                                                style={{ marginTop: '8px', color: '#555' }}
                                            >
                                                Toplam Bölme: {bolmeSayisi}
                                            </Typography>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleBolmeEkle(raf)}
                                                >
                                                    Bölme Ekle
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleBolmeCikart(raf)}
                                                >
                                                    Bölme Çıkart
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRafSil(raf)}
                                                >
                                                    Rafı Sil
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default DepoIslemleri;
