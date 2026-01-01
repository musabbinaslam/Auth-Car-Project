const rentalService = require('../services/rentalService');

const createRental = async (req, res, next) => {
    try {
        const userId = req.user.id; // from JWT middleware
        const rental = await rentalService.createRental(userId, req.body);
        res.status(201).json({
            status: 'success',
            data: { rental }
        });
    } catch (err) {
        next(err);
    }
};

const getAllRentals = async (req, res, next) => {
    try {
        const rentals = await rentalService.getAllRentals();
        res.status(200).json({
            status: 'success',
            data: { rentals }
        });
    } catch (err) {
        next(err);
    }
};

const cancelRental = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const rental = await rentalService.cancelRental(id, role, req.params.rentalId);
        res.status(200).json({
            status: 'success',
            data: { rental }
        });
    } catch (err) {
        next(err);
    }
};

const getUserRentals = async (req, res, next) => {
    try {
        const userId = req.user.id; // use logged-in user ID
        const rentals = await rentalService.getUserRentals(userId);
        res.status(200).json({
            status: 'success',
            data: { rentals }
        });
    } catch (err) {
        next(err);
    }
};

const completedRental = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const rental = await rentalService.completedRental(id, role, req.params.rentalId);
        res.status(200).json({
            status: 'success',
            data: { rental }
        });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createRental,
    getAllRentals,
    cancelRental,
    getUserRentals,
    completedRental,
};
