import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import { getAllCars, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/calcPrice'
import { FEATURES, FEATURE_LABELS } from '../utilities/carOptions'
import '../App.css'
import '../css/Car.css'

const ViewCars = ({ title }) => {
    const navigate = useNavigate()
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (title) document.title = title
    }, [title])

    const loadCars = async () => {
        try {
            const data = await getAllCars()
            setCars(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCars()
    }, [])

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return
        try {
            await deleteCar(id)
            setCars((prev) => prev.filter((car) => car.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className='page'><p aria-busy='true'>Loading cars…</p></div>
    if (error) return <div className='page'><div className='error-message'>❌ {error}</div></div>

    return (
        <div className='page'>
            <h2>Your Custom Cars</h2>

            {cars.length === 0 ? (
                <div className='empty-state'>
                    <p>No cars yet.</p>
                    <button onClick={() => navigate('/')}>Build your first car</button>
                </div>
            ) : (
                <div className='car-grid'>
                    {cars.map((car) => (
                        <article key={car.id} className='car-card'>
                            <CarPreview car={car} />
                            <h3>{car.name}</h3>
                            <p className='car-card-price'>{formatPrice(car.price)}</p>

                            <ul className='car-card-features'>
                                {FEATURES.map((feature) => (
                                    <li key={feature}>
                                        <span>{FEATURE_LABELS[feature]}:</span> {car[feature]}
                                    </li>
                                ))}
                            </ul>

                            <div className='car-card-actions'>
                                <Link to={`/customcars/${car.id}`} role='button' className='secondary'>
                                    View
                                </Link>
                                <Link to={`/edit/${car.id}`} role='button' className='secondary'>
                                    Edit
                                </Link>
                                <button className='danger' onClick={() => handleDelete(car.id, car.name)}>
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ViewCars
