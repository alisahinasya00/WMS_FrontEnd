/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMagaza } from '../../redux/loginSlice'; // Gerekli slice'ı import et
import { useNavigate } from 'react-router-dom';
import "./MagazaDashboard.css"

function magazaLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Add error message state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { magazalar = [], status } = useSelector((state) => state.login);

    useEffect(() => {
        dispatch(getMagaza());
    }, [dispatch]);

    const handleLogin = () => {
        if (status === 'loading') {
            alert('Veriler yükleniyor, lütfen bekleyin.');
            return;
        }

        const magaza = magazalar.find(c =>
            c.mail === username && // API'den gelen alan adlarını doğru kullandığınızdan emin olun
            c.sifre === password
        );

        if (magaza) {
            localStorage.setItem('magazaMail', magaza.mail); // Save admin user
            navigate('/magazaDashboard'); // Yönetici paneline yönlendir
        } else {
            setErrorMessage('Giriş başarısız: Kullanıcı adı veya şifre hatalı.'); // Update login failure message
        }
    };


    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" className="App" padding="20px">
            <Typography variant="h3" gutterBottom style={{ color: 'black', }}>
                Mağaza Girişi
            </Typography>
            <TextField
                label="Kullanıcı Adı (E-posta)"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Şifre"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                fullWidth
            />
            <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={status === 'loading'} // Yükleme sırasında butonu devre dışı bırak
                style={{
                    backgroundColor: 'black', // Siyah arka plan
                    color: 'white', // Beyaz yazı rengi
                    textTransform: 'none', // Yazı küçük-büyük harf dönüşümünü kaldır
                    padding: '10px',
                    fontSize: '16px',
                }}
            >
                Giriş Yap
            </Button>
            {status === 'loading' && <CircularProgress />} {/* Yükleme göstergesi */}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message */}
        </Box>
    )
}

export default magazaLogin
