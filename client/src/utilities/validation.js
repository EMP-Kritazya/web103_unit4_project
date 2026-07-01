// Front-end mirror of the backend's impossible-combination rules
// (server/config/carOptions.js -> validateCar). This lets the builder warn the
// user immediately; the backend still has the final say on save.

// Returns an array of error strings. Empty array means the combo is allowed.
export const validateCombination = (car) => {
    const errors = []

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

// Convenience boolean for enabling/disabling the save button.
export const isValidCombination = (car) => validateCombination(car).length === 0
