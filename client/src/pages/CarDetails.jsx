import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import { getCar, deleteCar } from '../services/CarsAPI'
import { formatPrice, getOptionPrice } from '../utilities/calcPrice'
import { FEATURES, FEATURE_LABELS, BASE_PRICE } from '../utilities/carOptions'
import '../App.css'
import '../css/Car.css'

const CarDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (title) document.title = title
    }, [title])

    useEffect(() => {
        const loadCar = async () => {
            try {
                const data = await getCar(id)
                setCar(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        loadCar()
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${car.name}"? This can't be undone.`)) return
        await deleteCar(id)
        navigate('/customcars')
    }

    if (loading) return <div className='page'><p aria-busy='true'>Loading car…</p></div>
    if (error) return <div className='page'><div className='error-message'>❌ {error}</div></div>

    return (
        <div className='page car-details'>
            <div className='car-details-preview'>
                <CarPreview car={car} />
            </div>

            <div className='car-details-info'>
                <h2>{car.name}</h2>
                <p className='car-details-price'>{formatPrice(car.price)}</p>

                <table className='breakdown'>
                    <tbody>
                        <tr>
                            <td>Base Price</td>
                            <td>{formatPrice(BASE_PRICE)}</td>
                        </tr>
                        {FEATURES.map((feature) => (
                            <tr key={feature}>
                                <td>
                                    {FEATURE_LABELS[feature]}: {car[feature]}
                                </td>
                                <td>+{formatPrice(getOptionPrice(feature, car[feature]))}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td><strong>{formatPrice(car.price)}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <div className='car-card-actions'>
                    <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                    <button className='danger' onClick={handleDelete}>Delete</button>
                    <Link to='/customcars' role='button' className='secondary'>Back to all cars</Link>
                </div>
            </div>
        </div>
    )
}

export default CarDetails
