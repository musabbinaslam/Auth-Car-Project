const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Static method to calc average ratings
reviewSchema.statics.calcAverageRatings = async function (carId) {
    const stats = await this.aggregate([
        {
            $match: { car: carId }
        },
        {
            $group: {
                _id: '$car',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Car').findByIdAndUpdate(carId, {
            ratingCount: stats[0].nRating,
            averageRating: stats[0].avgRating
        });
    } else {
        await mongoose.model('Car').findByIdAndUpdate(carId, {
            ratingCount: 0,
            averageRating: 0
        });
    }
};



reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.car);
});

// Calculate average rating after update or delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.clone().findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    if (this.r) {
        await this.r.constructor.calcAverageRatings(this.r.car);
    }
});

module.exports = mongoose.model('Review', reviewSchema);
