// All calls to the backend Cars API. Vite proxies '/api' -> http://localhost:3000
// (see client/vite.config.js), so relative URLs work in development.

const BASE_URL = '/api'

// Small helper: parse JSON and throw a useful error on non-2xx responses.
const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        // The backend sends { errors: [...] } for validation and { error } otherwise.
        const message = data.errors ? data.errors.join(' ') : data.error || 'Something went wrong'
        const error = new Error(message)
        error.errors = data.errors
        error.status = response.status
        throw error
    }

    return data
}

// GET all saved cars
export const getAllCars = async () => {
    const response = await fetch(`${BASE_URL}/cars`)
    return handleResponse(response)
}

// GET a single car by id
export const getCar = async (id) => {
    const response = await fetch(`${BASE_URL}/cars/${id}`)
    return handleResponse(response)
}

// POST a new car
export const createCar = async (car) => {
    const response = await fetch(`${BASE_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
    })
    return handleResponse(response)
}

// PUT (update) an existing car
export const updateCar = async (id, car) => {
    const response = await fetch(`${BASE_URL}/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
    })
    return handleResponse(response)
}

// DELETE a car
export const deleteCar = async (id) => {
    const response = await fetch(`${BASE_URL}/cars/${id}`, {
        method: 'DELETE',
    })
    return handleResponse(response)
}

export default { getAllCars, getCar, createCar, updateCar, deleteCar }
