import React from "react";

const StoreFilter = ({ onFilterChange }) => {
    return (
        <div>
            <label htmlFor="store">Mağaza Filtrele: </label>
            <select id="store" onChange={(e) => onFilterChange(e.target.value)}>
                <option value="">Tüm Mağazalar</option>
                <option value="Teknoloji Marketi">Teknoloji Marketi</option>
                <option value="Kitap Evi">Kitap Evi</option>
                <option value="Dijital Dünyası">Dijital Dünyası</option>
                <option value="Akıllı Teknoloji">Akıllı Teknoloji</option>
                <option value="TeknoShop">TeknoShop</option>
                <option value="TechnoStore">TechnoStore</option>
                <option value="Bilişim Merkezi">Bilişim Merkezi</option>
                <option value="Elektronik Dünyası">Elektronik Dünyası</option>
                <option value="Elektronik Dünyası">TechZone</option>
                <option value="Elektronik Dünyası">Mobil Teknoloji</option>
                <option value="Elektronik Dünyası">FutureTech</option>
            </select>
        </div>
    );
};

export default StoreFilter;
