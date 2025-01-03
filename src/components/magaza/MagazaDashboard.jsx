/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar'
import MainDash from './MainDash/MainDash'
import LoginHome from '../LoginHome';
import SiparisIslemleri from './SiparisIslemleri/SiparisIslemleri.jsx'
import UrunIslemleri from './UrunIslemleri/UrunIslemleri.jsx'
import Bilgilerim from './Bilgilerim/Bilgilerim.jsx'

function MagazaDashboard() {
    const [selectedScreen, setSelectedScreen] = useState('mainDash');
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        // localStorage.clear();
        navigate('/');
    };

    const renderScreen = () => {
        switch (selectedScreen) {
            case 'mainDash':
                return <MainDash />;
            case 'magaza':
                return <Bilgilerim />;
            case 'siparis':
                return <SiparisIslemleri />;
            case 'urun':
                return <UrunIslemleri />;
            default:
                return <MainDash />
        }
    };
    return (
        <div className="App">
            <div className="AppGlass">
                <Sidebar
                    setSelectedScreen={setSelectedScreen}
                    setSelected={setSelected} // Sidebar'a prop olarak aktarılıyor
                    selected={selected} // Sidebar'da hangi öğenin seçili olduğunu göstermek için
                    handleLogout={handleLogout}
                />
                {renderScreen()} {/* Burada seçilen ekrana göre bileşen render edilecek */}
                {/* <RightSide /> */}
            </div>
        </div>
    )
}

export default MagazaDashboard
