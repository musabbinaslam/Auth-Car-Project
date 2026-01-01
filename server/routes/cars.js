const express = require('express');
const router = express.Router();
const { createCar, getAllCars, getCarById, updateCar, deleteCar, fixRatings } = require('../controllers/carController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Admin-only routes
router.post('/', authenticateToken, isAdmin, createCar);
router.put('/:id', authenticateToken, isAdmin, updateCar);
router.delete('/:id', authenticateToken, isAdmin, deleteCar);

// Public routes
router.get('/', getAllCars);

router.get('/:id', getCarById);

module.exports = router;
