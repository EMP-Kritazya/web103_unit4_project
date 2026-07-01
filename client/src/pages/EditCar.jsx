import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CarBuilder from '../components/CarBuilder'
import { getCar, updateCar } from '../services/CarsAPI'
import '../App.css'

const EditCar = ({ title }) => {
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

    const handleUpdate = async (updated) => {
        await updateCar(id, updated)
        navigate(`/customcars/${id}`)
    }

    if (loading) return <div className='page'><p aria-busy='true'>Loading car…</p></div>
    if (error) return <div className='page'><div className='error-message'>❌ {error}</div></div>

    return (
        <div className='page'>
            <h2>Edit “{car.name}”</h2>
            <p>Update your options — the price recalculates automatically.</p>
            <CarBuilder initialCar={car} submitLabel='Update Car' onSubmit={handleUpdate} />
        </div>
    )
}

export default EditCar
