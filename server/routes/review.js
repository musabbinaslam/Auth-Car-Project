const express = require('express');

const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Protect all review routes
router.use(authenticateToken);

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
