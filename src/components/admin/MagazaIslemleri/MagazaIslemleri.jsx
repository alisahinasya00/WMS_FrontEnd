/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMagazalar } from '../../../redux/magazaSlice'  // magazaSlice'tan fetchMagazalar'ı import et

const MagazaIslemleri = () => {
    const dispatch = useDispatch()
    const { magazalar, loading, error } = useSelector((state) => state.magaza)
    console.log('Magazalar:', magazalar)
    // Mağazaları fetch etmek için useEffect kullan
    useEffect(() => {
        dispatch(fetchMagazalar())
    }, [dispatch])

    if (!Array.isArray(magazalar)) {
        return <p>Magazalar verisi geçerli değil.</p>
    }


    return (
        <div>
            <h1>Mağazalar</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <ul>
                {magazalar.map((magaza) => (
                    <li key={magaza.id}>
                        {magaza.name} - {magaza.location}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MagazaIslemleri
