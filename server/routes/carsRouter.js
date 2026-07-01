import express from 'express'
import CarsController from '../controllers/carsController.js'

const router = express.Router()

// Fixed option/pricing data for the builder
router.get('/options', CarsController.getOptions)

// CRUD routes for custom cars
router.get('/cars', CarsController.getCars)
router.get('/cars/:id', CarsController.getCar)
router.post('/cars', CarsController.createCar)
router.put('/cars/:id', CarsController.updateCar)
router.delete('/cars/:id', CarsController.deleteCar)

export default router
