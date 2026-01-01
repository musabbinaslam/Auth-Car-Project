const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('../models/Car');
const Review = require('../models/Review');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car_rental', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const fixRatings = async () => {
    try {
        await connectDB();

        const cars = await Car.find();
        console.log(`Found ${cars.length} cars. Checking ratings...`);

        for (const car of cars) {
            // Find all reviews for this car
            const reviews = await Review.find({ car: car._id });
            const reviewCount = reviews.length;

            console.log(`Car: ${car.name}, DB Rating Count: ${car.ratingCount}, Actual Reviews: ${reviewCount}`);

            if (reviewCount === 0) {
                // Should be 0 and 0
                if (car.ratingCount !== 0 || car.averageRating !== 0) {
                    console.log(`Fixing car ${car.name}...`);
                    car.ratingCount = 0;
                    car.averageRating = 0;
                    await car.save();
                }
            } else {
                // Recalculate properly
                const avg = reviews.reduce((acc, item) => acc + item.rating, 0) / reviewCount;

                if (car.ratingCount !== reviewCount || car.averageRating !== avg) {
                    console.log(`Fixing car ${car.name}...`);
                    car.ratingCount = reviewCount;
                    car.averageRating = avg;
                    await car.save();
                }
            }
        }

        console.log('All car ratings verified and fixed.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing ratings:', error);
        process.exit(1);
    }
};

fixRatings();
