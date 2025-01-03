/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./MainDash.css";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import StoreFilter from "../Table/StoreFilter";

const MainDash = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Veri çekme işlemleri
        const iadeResponse = await fetch("http://localhost:5002/api/Iadeislem");
        const iadeData = await iadeResponse.json();

        const girisResponse = await fetch("http://localhost:5002/api/GirisIslem");
        const girisData = await girisResponse.json();

        const cikisResponse = await fetch("http://localhost:5002/api/CikisIslem");
        const cikisData = await cikisResponse.json();

        const allData = [
          ...iadeData.data.map((item) => ({ ...item, islemAdi: "İade" })),
          ...girisData.data.map((item) => ({ ...item, islemAdi: "Giriş" })),
          ...cikisData.data.map((item) => ({ ...item, islemAdi: "Çıkış" })),
        ];

        setAllTransactions(allData);
        setFilteredTransactions(allData);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (store) => {
    setSelectedStore(store);
    if (store) {
      setFilteredTransactions(allTransactions.filter((t) => t.magazaAdi === store));
    } else {
      setFilteredTransactions(allTransactions);
    }
  };

  return (
    <div className="MainDash">
      <h1>Ana Sayfa</h1>
      <Cards />
      <StoreFilter onFilterChange={handleFilterChange} />
      <h2>İşlemler</h2>
      <Table data={filteredTransactions} title="Tüm İşlemler" />
    </div>
  );
};

export default MainDash;
