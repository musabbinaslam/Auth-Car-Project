const mongoose = require('mongoose');
const Rental = require('../models/Rental');
const Car = require('../models/Car');
const User = require('../models/User');
const rentalService = require('../services/rentalService');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Create a dummy user and car if needed, or pick existing ones.
        // For simplicity, let's just pick one existing user and car.
        const user = await User.findOne();
        const car = await Car.findOne();

        if (!user || !car) {
            console.error('Need at least one user and one car in DB');
            process.exit(1);
        }

        // 2. Create a rental that ended yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Manually create to bypass validation if necessary, or just use create directly
        const expiredRental = await Rental.create({
            user: user._id,
            car: car._id,
            startDate: twoDaysAgo,
            endDate: yesterday,
            totalPrice: 100,
            status: 'booked'
        });

        console.log(`Created expired rental: ${expiredRental._id} with status: ${expiredRental.status}`);

        // 3. Fetch rentals via service (which SHOULD trigger the update after our fix)
        console.log('Fetching rentals...');
        // We simulate a user fetching their rentals
        await rentalService.getUserRentals(user._id);

        // 4. Check status again
        const updatedRental = await Rental.findById(expiredRental._id);
        console.log(`Rental status after fetch: ${updatedRental.status}`);

        if (updatedRental.status === 'completed') {
            console.log('SUCCESS: Rental automatically marked as completed.');
        } else {
            console.log('FAILURE: Rental still booked.');
        }

        // Cleanup
        await Rental.deleteOne({ _id: expiredRental._id });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
