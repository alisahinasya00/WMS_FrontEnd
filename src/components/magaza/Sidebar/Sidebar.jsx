/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import "./Sidebar.css"
import Logo from '../../../imgs/logo.png'
import { MagazaSidebarData } from '../../../Data/Data'
import { IoMdLogOut } from "react-icons/io";

const Sidebar = ({ setSelectedScreen, setSelected, selected, handleLogout }) => {

    const handleMenuClick = (screen, index) => {
        setSelectedScreen(screen);  // AdminDashboard'dan gelen prop
        setSelected(index);  // Menüdeki seçili durumu güncelle
    };

    return (
        <div className='Sidebar'>
            <div className="logo">
                <img src={Logo} alt='' />
                <span>
                    WMS
                </span>
            </div>

            <div className="menu">
                {MagazaSidebarData.map((item, index) => {
                    return (
                        <div
                            className={selected === index ? 'menuItem active' : 'menuItem'}
                            key={index}
                            onClick={() => handleMenuClick(item.screen, index)}
                        >
                            <item.icon />
                            <span>{item.heading}</span>
                        </div>
                    );
                })}

                <div className="menuItem" onClick={handleLogout}>
                    <IoMdLogOut />
                    <span>Çıkış Yap</span>
                </div>
            </div>


        </div >


    )
}


export default Sidebar
