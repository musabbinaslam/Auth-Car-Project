const Review = require('../models/Review');

const createReview = async (reviewData) => {
    return await Review.create(reviewData);
};

const getAllReviews = async (userId) => {

    return await Review.find({ user: userId }).populate('car');
};

const getReviewById = async (userId, id) => {
    return await Review.findOne({ _id: id, user: userId }).populate('car');
};

const updateReview = async (userId, id, data) => {
    // Ensure the user owns the review
    return await Review.findOneAndUpdate(
        { _id: id, user: userId },
        data,
        { new: true, runValidators: true }
    );
};

const deleteReview = async (userId, id) => {
    return await Review.findOneAndDelete({ _id: id, user: userId });
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview
};