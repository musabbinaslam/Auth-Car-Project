const Car = require('../models/Car');

const createCar = async (carData) => {
    const car = await Car.create(carData);
    return car;
};

const getAllCars = async (queryParams = {}) => {
    const { type, fuelType, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = queryParams;
    const query = {};
    if (type) query.type = type;
    if (fuelType) query.fuelType = fuelType;
    if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) query.pricePerDay.$gte = minPrice;
        if (maxPrice) query.pricePerDay.$lte = maxPrice;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { model: { $regex: search, $options: 'i' } }
        ];
    }

    let mongooseQuery = Car.find(query);

    // Sorting
    if (sort) {
        const sortBy = sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const cars = await mongooseQuery.skip(skip).limit(limitNum);
    const total = await Car.countDocuments(query);

    return {
        cars,
        pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            limit: limitNum
        }
    };
};

const getCarById = async (id) => {
    const car = await Car.findById(id).populate('reviews');
    return car;
};

const updateCar = async (id, carData) => {
    const car = await Car.findByIdAndUpdate(id, carData, { new: true });
    return car;
};

const deleteCar = async (id) => {
    const car = await Car.findByIdAndDelete(id);
    return car;
};

module.exports = {
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
};
