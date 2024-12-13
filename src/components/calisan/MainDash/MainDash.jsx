/* eslint-disable no-unused-vars */
import React from 'react'
import './MainDash.css'
import Cards from '../Cards/Cards'
import Table from '../Table/Table'

const MainDash = () => {
    return (
        <div className="MainDash">
            <h1>Ana Sayfa</h1>
            <Cards />
            <h2>Son Siparişler</h2>
            <Table />
            <div></div>
        </div>
    )
}

export default MainDash
