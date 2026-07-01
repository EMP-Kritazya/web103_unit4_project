import { BASE_PRICE, OPTIONS, FEATURES } from './carOptions.js'

// Price of a single selected option, e.g. getOptionPrice('roof', 'Moonroof') -> 2000
export const getOptionPrice = (feature, name) => {
    const option = OPTIONS[feature]?.find((o) => o.name === name)
    return option ? option.price : 0
}

// Total = base price + every selected option's price.
// Used for the live price display; the backend recomputes this on save.
export const calculateTotalPrice = (car) =>
    FEATURES.reduce((total, feature) => total + getOptionPrice(feature, car[feature]), BASE_PRICE)

// Format a number as USD, e.g. formatPrice(30500) -> "$30,500"
export const formatPrice = (amount) =>
    `$${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
