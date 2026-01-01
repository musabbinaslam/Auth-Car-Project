const reviewService = require('../services/reviewService');
const createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const carId = req.params.carId || req.body.carId || req.body.car;

        const reviewData = {
            ...req.body,
            user: userId,
            car: carId
        };

        const review = await reviewService.createReview(reviewData);
        res.status(201).json({
            status: 'success',
            data: { review }
        });
    } catch (err) {
        next(err);
    }
};
const getAllReviews = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviews = await reviewService.getAllReviews(userId);
        res.status(200).json({
            status: 'success',
            data: { reviews }
        });
    } catch (err) {
        next(err);
    }
};
const getReviewById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const review = await reviewService.getReviewById(userId, req.params.id);
        res.status(200).json({
            status: 'success',
            data: { review }
        });
    } catch (err) {
        next(err);
    }
};
const updateReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const review = await reviewService.updateReview(userId, req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: { review }
        });
    } catch (err) {
        next(err);
    }
};
const deleteReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const review = await reviewService.deleteReview(userId, req.params.id);
        res.status(200).json({
            status: 'success',
            data: { review }
        });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview
};
