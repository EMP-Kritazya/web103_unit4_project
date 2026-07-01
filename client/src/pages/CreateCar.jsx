import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CarBuilder from '../components/CarBuilder'
import { createCar } from '../services/CarsAPI'
import { defaultCar } from '../utilities/carOptions'
import '../App.css'

const CreateCar = ({ title }) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (title) document.title = title
    }, [title])

    const handleCreate = async (car) => {
        const created = await createCar(car)
        navigate(`/customcars/${created.id}`)
    }

    return (
        <div className='page'>
            <h2>Build Your Bolt Bucket</h2>
            <p>Choose your options and watch the price update in real time.</p>
            <CarBuilder initialCar={defaultCar()} submitLabel='Save Car' onSubmit={handleCreate} />
        </div>
    )
}

export default CreateCar
