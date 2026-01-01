const express = require('express');
const router = express.Router();
const { createRental, getUserRentals, cancelRental, getAllRentals, completedRental } = require('../controllers/rentalController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', authenticateToken, createRental);
router.get('/me', authenticateToken, getUserRentals);
router.put('/cancel/:rentalId', authenticateToken, cancelRental);
router.put('/completed/:rentalId', authenticateToken, completedRental);

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllRentals);

module.exports = router;
