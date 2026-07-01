import React, { useState } from 'react'
import CarPreview from './CarPreview'
import { OPTIONS, FEATURES, FEATURE_LABELS } from '../utilities/carOptions'
import { calculateTotalPrice, formatPrice } from '../utilities/calcPrice'
import { validateCombination } from '../utilities/validation'
import '../css/Car.css'

// Reusable builder form shared by CreateCar and EditCar.
// Props:
//   initialCar  - the starting configuration
//   submitLabel - text for the submit button
//   onSubmit    - async (car) => {}  (parent handles the API call + navigation)
const CarBuilder = ({ initialCar, submitLabel, onSubmit }) => {
    const [car, setCar] = useState(initialCar)
    const [submitting, setSubmitting] = useState(false)
    const [serverErrors, setServerErrors] = useState([])

    const comboErrors = validateCombination(car)
    const totalPrice = calculateTotalPrice(car)
    const canSubmit = car.name.trim() !== '' && comboErrors.length === 0 && !submitting

    const selectOption = (feature, name) => {
        setServerErrors([])
        setCar((prev) => ({ ...prev, [feature]: name }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!canSubmit) return

        setSubmitting(true)
        setServerErrors([])
        try {
            await onSubmit(car)
        } catch (error) {
            // Prefer field-level validation errors from the backend when present.
            setServerErrors(error.errors || [error.message])
            setSubmitting(false)
        }
    }

    return (
        <form className='car-builder' onSubmit={handleSubmit}>
            <section className='car-builder-preview'>
                <CarPreview car={car} />

                <div className='car-price'>
                    <span>Total Price</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                </div>
            </section>

            <section className='car-builder-controls'>
                <label>
                    Car Name
                    <input
                        type='text'
                        placeholder='e.g. Midnight Cruiser'
                        value={car.name}
                        onChange={(e) => selectOption('name', e.target.value)}
                    />
                </label>

                {FEATURES.map((feature) => (
                    <fieldset key={feature} className='feature-selector'>
                        <legend>{FEATURE_LABELS[feature]}</legend>
                        <div className='feature-options'>
                            {OPTIONS[feature].map((option) => {
                                const selected = car[feature] === option.name
                                return (
                                    <button
                                        type='button'
                                        key={option.name}
                                        className={`option-chip ${selected ? 'selected' : ''}`}
                                        onClick={() => selectOption(feature, option.name)}
                                    >
                                        <span>{option.name}</span>
                                        <small>
                                            {option.price === 0 ? 'Included' : `+${formatPrice(option.price)}`}
                                        </small>
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>
                ))}

                {comboErrors.length > 0 && (
                    <div className='error-message' role='alert'>
                        {comboErrors.map((msg, i) => (
                            <p key={i}>⚠️ {msg}</p>
                        ))}
                    </div>
                )}

                {serverErrors.length > 0 && (
                    <div className='error-message' role='alert'>
                        {serverErrors.map((msg, i) => (
                            <p key={i}>❌ {msg}</p>
                        ))}
                    </div>
                )}

                <button type='submit' className='submit-button' disabled={!canSubmit} aria-busy={submitting}>
                    {submitting ? 'Saving…' : submitLabel}
                </button>
            </section>
        </form>
    )
}

export default CarBuilder
