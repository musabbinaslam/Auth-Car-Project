const carService = require('../services/carService');

// Create car (Admin only)
const createCar = async (req, res, next) => {
    try {
        const car = await carService.createCar(req.body);
        res.status(201).json({ status: 'success', data: { car } });
    } catch (err) {
        next(err);
    }
};

// Get all cars (with optional query filters)
const getAllCars = async (req, res, next) => {
    try {
        const filters = req.query; // e.g., type, priceMin, priceMax, search, sort, page, limit
        const result = await carService.getAllCars(filters);
        res.status(200).json({
            status: 'success',
            data: {
                cars: result.cars,
                pagination: result.pagination
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get car by ID
const getCarById = async (req, res, next) => {
    try {
        const car = await carService.getCarById(req.params.id);
        res.status(200).json({ status: 'success', data: { car } });
    } catch (err) {
        next(err);
    }
};

// Update car (Admin only)
const updateCar = async (req, res, next) => {
    try {
        const car = await carService.updateCar(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { car } });
    } catch (err) {
        next(err);
    }
};

// Delete car (Admin only)
const deleteCar = async (req, res, next) => {
    try {
        const car = await carService.deleteCar(req.params.id);
        res.status(200).json({ status: 'success', data: { car } });
    } catch (err) {
        next(err);
    }
};



module.exports = {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
};
