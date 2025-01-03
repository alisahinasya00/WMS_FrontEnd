/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./MainDash.css";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";

const MainDash = () => {
    const [allTransactions, setAllTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // İade işlemleri verisi
                const iadeResponse = await fetch("http://localhost:5002/api/Iadeislem");
                const iadeData = await iadeResponse.json();

                // Giriş işlemleri verisi
                const girisResponse = await fetch("http://localhost:5002/api/GirisIslem");
                const girisData = await girisResponse.json();

                // Çıkış işlemleri verisi
                const cikisResponse = await fetch("http://localhost:5002/api/CikisIslem");
                const cikisData = await cikisResponse.json();

                // Verileri birleştir
                const allData = [
                    ...iadeData.data.map((item) => ({ ...item, islemAdi: "İade" })),
                    ...girisData.data.map((item) => ({ ...item, islemAdi: "Giriş" })),
                    ...cikisData.data.map((item) => ({ ...item, islemAdi: "Çıkış" })),
                ];

                // Verileri state'e kaydet
                setAllTransactions(allData);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="MainDash">
            <h1>Ana Sayfa</h1>
            <Cards />
            <h2>İşlemler</h2>
            <Table data={allTransactions} title="Tüm İşlemler" />
        </div>
    );
};

export default MainDash;
