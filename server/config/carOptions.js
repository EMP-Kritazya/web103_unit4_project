// Fixed configuration data for the Bolt Bucket car customizer.
// The backend is the source of truth for pricing and validation so the
// frontend can never save an item with a wrong price or an illegal combo.

export const BASE_PRICE = 30000

// Each option is { name, price } where price is the amount added to BASE_PRICE.
export const OPTIONS = {
    exterior: [
        { name: 'Silver', price: 0 },
        { name: 'Black', price: 500 },
        { name: 'Blue', price: 750 },
        { name: 'Red', price: 1000 },
        { name: 'Matte Green', price: 1500 },
    ],
    roof: [
        { name: 'Body Color', price: 0 },
        { name: 'Black Roof', price: 800 },
        { name: 'Moonroof', price: 2000 },
        { name: 'Convertible', price: 5000 },
    ],
    wheels: [
        { name: '18" Silver Alloy', price: 0 },
        { name: '19" Black Alloy', price: 1200 },
        { name: '20" Chrome', price: 2500 },
    ],
    interior: [
        { name: 'Charcoal Cloth', price: 0 },
        { name: 'Black Leather', price: 1800 },
        { name: 'White Leather', price: 2500 },
    ],
}

// The four fields that make up a car configuration.
export const FEATURES = ['exterior', 'roof', 'wheels', 'interior']

// Look up the price of a single option by feature + name.
const optionPrice = (feature, name) => {
    const option = OPTIONS[feature]?.find((o) => o.name === name)
    return option ? option.price : 0
}

// Total price = base + the price of every selected option.
export const calculatePrice = (car) =>
    FEATURES.reduce((total, feature) => total + optionPrice(feature, car[feature]), BASE_PRICE)

// Returns an array of human-readable error strings. Empty array means valid.
export const validateCar = (car) => {
    const errors = []

    // 1) Every feature must be a real, known option.
    for (const feature of FEATURES) {
        const value = car[feature]
        if (!value) {
            errors.push(`Please choose a ${feature} option.`)
        } else if (!OPTIONS[feature].some((o) => o.name === value)) {
            errors.push(`"${value}" is not a valid ${feature} option.`)
        }
    }

    // A name is required for a saved custom car.
    if (!car.name || !car.name.trim()) {
        errors.push('Please give your car a name.')
    }

    // Stop here if any option is missing/invalid — the combo rules below assume valid values.
    if (errors.length > 0) return errors

    // 2) Impossible combinations (business rules).
    if (car.roof === 'Convertible' && car.interior === 'White Leather') {
        errors.push('White Leather interior is not available with a Convertible roof (sun damage).')
    }
    if (car.wheels === '20" Chrome' && car.interior === 'Charcoal Cloth') {
        errors.push('20" Chrome wheels require a leather interior.')
    }
    if (car.exterior === 'Matte Green' && car.roof === 'Convertible') {
        errors.push('Matte Green exterior cannot be paired with a Convertible roof.')
    }

    return errors
}
