import { pool } from '../config/database.js'
import { calculatePrice, validateCar, OPTIONS, BASE_PRICE } from '../config/carOptions.js'

// GET /api/cars  -> all saved cars, newest first
const getCars = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM cars ORDER BY created_at DESC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// GET /api/cars/:id  -> a single car
const getCar = async (req, res) => {
    try {
        const { id } = req.params
        const results = await pool.query('SELECT * FROM cars WHERE id = $1', [id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: `Car with id ${id} not found` })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// POST /api/cars  -> validate combo, calculate price on the server, then save
const createCar = async (req, res) => {
    try {
        const { name, exterior, roof, wheels, interior } = req.body
        const car = { name, exterior, roof, wheels, interior }

        const errors = validateCar(car)
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        // Never trust a price from the client — always recompute it.
        const price = calculatePrice(car)

        const results = await pool.query(
            `INSERT INTO cars (name, exterior, roof, wheels, interior, price)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name.trim(), exterior, roof, wheels, interior, price]
        )

        res.status(201).json(results.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// PUT /api/cars/:id  -> validate + recalculate price, then update
const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const { name, exterior, roof, wheels, interior } = req.body
        const car = { name, exterior, roof, wheels, interior }

        const errors = validateCar(car)
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        const price = calculatePrice(car)

        const results = await pool.query(
            `UPDATE cars
             SET name = $1, exterior = $2, roof = $3, wheels = $4, interior = $5, price = $6
             WHERE id = $7
             RETURNING *`,
            [name.trim(), exterior, roof, wheels, interior, price, id]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: `Car with id ${id} not found` })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// DELETE /api/cars/:id
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const results = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: `Car with id ${id} not found` })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// GET /api/options  -> the fixed option/pricing data the builder needs
const getOptions = async (req, res) => {
    res.status(200).json({ options: OPTIONS, basePrice: BASE_PRICE })
}

export default { getCars, getCar, createCar, updateCar, deleteCar, getOptions }
