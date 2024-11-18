/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Sidebar from './Sidebar/Sidebar'
import MainDash from './MainDash/MainDash'
import RightSide from './RightSide/RightSide'
import { useNavigate } from 'react-router-dom';  // useNavigate hook'u
import LoginHome from '../LoginHome';
import CalisanIslemleri from './CalisanIslemleri/CalisanIslemleri.jsx';
function AdminDashboard() {

    const [selectedScreen, setSelectedScreen] = useState('mainDash');
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Burada çıkış işlemleri yapılabilir (örneğin, token silme)
        //alert('Çıkış yapılıyor...'); // Çıkış mesajı
        navigate('/');  // Kullanıcıyı login sayfasına yönlendiriyoruz
    };

    const renderScreen = () => {
        switch (selectedScreen) {
            case 'mainDash':
                return <MainDash />;
            case 'products':
                return <CalisanIslemleri />;
            case 'employees':
                return <div>bbb</div>;
            case 'orders':
                return <div>ccc</div>;
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
                <RightSide />
            </div>
        </div>
    );
}

export default AdminDashboard
