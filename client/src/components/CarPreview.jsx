import React from 'react'
import { EXTERIOR_COLOR_HEX } from '../utilities/carOptions'
import '../css/Car.css'

// Simple CSS-drawn car whose body color changes with the exterior selection.
// This satisfies the "interface changes visually beyond text" requirement.
const CarPreview = ({ car }) => {
    const bodyColor = EXTERIOR_COLOR_HEX[car.exterior] || '#c0c4c8'
    const roofIsGlass = car.roof === 'Moonroof' || car.roof === 'Convertible'

    return (
        <div className='car-preview'>
            <div className='car-body' style={{ backgroundColor: bodyColor }}>
                <div
                    className='car-cabin'
                    style={{
                        backgroundColor: roofIsGlass ? 'rgba(120, 190, 230, 0.6)' : bodyColor,
                        borderColor: bodyColor,
                    }}
                />
                <div className='car-wheel car-wheel-front' />
                <div className='car-wheel car-wheel-back' />
            </div>

            <div className='car-preview-caption'>
                <span style={{ backgroundColor: bodyColor }} className='car-swatch' />
                {car.exterior} · {car.roof}
            </div>
        </div>
    )
}

export default CarPreview
