/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCalisanlar, updateCalisan } from '../../../redux/calisanSlice';
import { Box, Typography, Button, TextField } from '@mui/material';
import InputMask from 'react-input-mask';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Bilgilerim.css';

const Bilgilerim = () => {
    const dispatch = useDispatch();
    const { calisanlar, status, error } = useSelector((state) => state.calisan);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [updatedData, setUpdatedData] = useState({ mail: '', sifre: '', telefonNo: '', adres: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCalisanlar());
        }
    }, [dispatch, status]);

    const userMail = localStorage.getItem('userMail');
    const user = calisanlar.find((calisan) => calisan.mail === userMail);

    useEffect(() => {
        if (user) {
            setUpdatedData({
                mail: user.mail,
                sifre: user.sifre,
                telefonNo: user.telefonNo,
                adres: user.adres,
                rolId: 2
            });
        }
    }, [user]);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!regex.test(email)) {
            setEmailError('Geçerli bir e-posta adresi girin.');
        } else {
            setEmailError('');
        }
    };

    const validatePhone = (phone) => {
        const regex = /^\(\d{3}\) \d{3} \d{2} \d{2}$/;
        if (!regex.test(phone)) {
            setPhoneError('Geçerli bir telefon numarası girin. Örn: (555) 123 45 67');
        } else {
            setPhoneError('');
        }
    };

    const validatePassword = (password) => {
        if (password.length < 5) {
            setPasswordError('Şifre en az 5 karakter uzunluğunda olmalıdır.');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (confirmPassword !== updatedData.sifre) {
            setConfirmPasswordError('Şifreler uyuşmuyor.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleUpdate = () => {
        if (emailError || phoneError || passwordError || confirmPasswordError) {
            return;
        }
        const updatedUser = { ...user, ...updatedData };
        dispatch(updateCalisan({ updatedData: updatedUser }))
            .then(() => {
                dispatch(fetchCalisanlar());
                localStorage.setItem('userMail', updatedData.mail);
            })
            .catch((error) => {
                console.error('Update failed:', error);
            });
        // Modal verilerini temizleyip kapatıyoruz
        resetModal();
    };

    const resetModal = () => {
        setUpdatedData({ mail: '', sifre: '', telefonNo: '', adres: '' });
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setIsModalOpen(false);
    };

    if (status === 'loading') {
        return <Typography>Yükleniyor...</Typography>;
    }

    if (status === 'failed') {
        return <Typography color="error">Hata: {error}</Typography>;
    }

    if (!user) {
        return <Typography color="error">Kullanıcı bilgisi bulunamadı.</Typography>;
    }

    return (
        <Box className="card-container">
            <Typography variant="h4" className="card-title">Kullanıcı Bilgilerim</Typography>
            <Typography variant="body1" className="card-item">Adı: {user.adi}</Typography>
            <Typography variant="body1" className="card-item">Soyadı: {user.soyadi}</Typography>
            <Typography variant="body1" className="card-item">Adres: {user.adres}</Typography>
            <Typography variant="body1" className="card-item">Maaş: {user.maas}</Typography>
            <Typography variant="body1" className="card-item">Telefon No: {user.telefonNo}</Typography>
            <Typography variant="body1" className="card-item">E-posta: {user.mail}</Typography>
            <Box className="password-container">
                <Typography variant="body1" className="card-item">
                    Şifre: {showPassword ? user.sifre : '********'}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-button"
                    startIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                >
                </Button>
            </Box>
            <Typography variant="body1" className="card-item">
                İşe Giriş Tarihi: {new Date(user.iseGirisTarihi).toLocaleDateString('tr-TR')}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsModalOpen(true)}
                className="update-button"
            >
                Güncelle
            </Button>

            {isModalOpen && (
                <Box className="modal-overlay">
                    <Box className="modal-container">
                        <Box className="modal-content">
                            <Typography variant="h6">Bilgilerinizi Güncelleyin</Typography>
                            <TextField
                                label="E-posta"
                                value={updatedData.mail}
                                onChange={(e) => {
                                    const email = e.target.value;
                                    setUpdatedData({ ...updatedData, mail: email });
                                    validateEmail(email);
                                }}
                                fullWidth
                                margin="normal"
                                error={!!emailError}
                                helperText={emailError}
                                type="email"
                            />
                            <TextField
                                label="Şifre"
                                value={updatedData.sifre}
                                onChange={(e) => {
                                    const password = e.target.value;
                                    setUpdatedData({ ...updatedData, sifre: password });
                                    validatePassword(password);
                                }}
                                fullWidth
                                margin="normal"
                                type={showPassword2 ? "text" : "password"}
                                error={!!passwordError}
                                helperText={passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => setShowPassword2(!showPassword2)}
                                            className="toggle-button"
                                            startIcon={showPassword2 ? <VisibilityOff /> : <Visibility />}
                                        />
                                    ),
                                }}
                            />
                            <TextField
                                label="Şifre (Tekrar)"
                                value={updatedData.confirmSifre}
                                onChange={(e) => {
                                    const confirmPassword = e.target.value;
                                    setUpdatedData({ ...updatedData, confirmSifre: confirmPassword });
                                    validateConfirmPassword(confirmPassword);
                                }}
                                fullWidth
                                margin="normal"
                                type={showPassword3 ? "text" : "password"}
                                error={!!confirmPasswordError}
                                helperText={confirmPasswordError}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => setShowPassword3(!showPassword3)}
                                            className="toggle-button"
                                            startIcon={showPassword3 ? <VisibilityOff /> : <Visibility />}
                                        />
                                    ),
                                }}
                            />
                            <InputMask
                                mask="(999) 999 99 99"
                                value={updatedData.telefonNo}
                                onChange={(e) => {
                                    const phone = e.target.value;
                                    setUpdatedData({ ...updatedData, telefonNo: phone });
                                    validatePhone(phone);
                                }}
                            >
                                {(inputProps) => (
                                    <TextField
                                        {...inputProps}
                                        label="Telefon No"
                                        fullWidth
                                        margin="normal"
                                        error={!!phoneError}
                                        helperText={phoneError}
                                    />
                                )}
                            </InputMask>
                            <TextField
                                label="Adres"
                                value={updatedData.adres}
                                onChange={(e) => setUpdatedData({ ...updatedData, adres: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <Box className="modal-actions">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdate}
                                    className="save-button"
                                    disabled={emailError || phoneError || passwordError || confirmPasswordError}
                                >
                                    Güncelle
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={resetModal} // Modal'ı sıfırlayıp kapat
                                    className="cancel-button"
                                >
                                    İptal
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Bilgilerim;
