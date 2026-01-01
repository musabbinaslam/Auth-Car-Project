const Rental = require('../models/Rental');
const Car = require('../models/Car');
const AppError = require('../utils/errors');

const createRental = async (userId, { carId, startDate, endDate }) => {
    const overlappingRental = await Rental.findOne({
        car: carId,
        $or: [
            { startDate: { $lte: endDate, $gte: startDate } },
            { endDate: { $lte: endDate, $gte: startDate } },
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
        ]
    });

    if (overlappingRental) throw new AppError('Car is already booked for these dates', 400);

    const car = await Car.findById(carId);
    if (!car) throw new AppError('Car not found', 404);

    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    const totalPrice = days * car.pricePerDay;

    const rental = await Rental.create({
        user: userId,
        car: carId,
        startDate,
        endDate,
        totalPrice,
        status: 'booked'
    });

    return rental;
};


const _updateOverdueRentals = async () => {
    try {
        await Rental.updateMany(
            {
                status: 'booked',
                endDate: { $lt: new Date() }
            },
            {
                $set: { status: 'completed' }
            }
        );
    } catch (error) {
        console.error('Error updating overdue rentals:', error);
    }
};

const getUserRentals = async (userId) => {
    await _updateOverdueRentals();
    return Rental.find({ user: userId }).populate('car');
};

const cancelRental = async (userId, role, rentalId) => {
    const query = { _id: rentalId };
    if (role !== 'admin') {
        query.user = userId;
    }

    const rental = await Rental.findOne(query);
    if (!rental) throw new AppError('Rental not found or not authorized', 404);

    // Admins can cancel anytime, Users can only cancel future bookings
    if (role !== 'admin' && new Date(rental.startDate) <= new Date()) {
        throw new AppError('Cannot cancel rental that has started', 400);
    }

    rental.status = 'cancelled';
    await rental.save();
    return rental;
};

const getAllRentals = async () => {
    await _updateOverdueRentals();
    return Rental.find().populate('user').populate('car');
};

const completedRental = async (userId, role, rentalId) => {
    const query = { _id: rentalId };
    if (role !== 'admin') {
        query.user = userId;
    }

    const rental = await Rental.findOne(query);
    if (!rental) throw new AppError('Rental not found or not authorized', 404);

    if (rental.status !== 'booked') {
        throw new AppError('Rental is not active or already processed', 400);
    }

    rental.status = 'completed';
    await rental.save();
    return rental;
};
const checkExpiredRentals = async () => {
    const now = new Date();
    const rentals = await Rental.find({ status: 'booked', endDate: { $lt: now } });
    for (const rental of rentals) {
        rental.status = 'completed';
        await rental.save();
    }
    return rentals.length;
};
module.exports = {
    createRental,
    getUserRentals,
    cancelRental,
    getAllRentals,
    completedRental,
    checkExpiredRentals,
};
