const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['sedan', 'SUV', 'hatchback'],
        required: true
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric', 'hybrid'],
        required: true
    },
    transmission: {
        type: String,
        enum: ['manual', 'automatic'],
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    features: {
        type: [String] //['AC', 'GPS', 'Music System']
    },
    images: {
        type: [String] //pictures
    },
    available: {
        type: Boolean,
        default: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate
carSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'car',
    localField: '_id'
});

module.exports = mongoose.model('Car', carSchema);
