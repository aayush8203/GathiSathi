const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mode: {
        type: String,
        enum: ['car', 'bike'],
        default: 'car'
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seatsOffered: {
        type: Number,
        default: 1
    },
    seatsBooked: {
        type: Number,
        default: 0
    },
    vehicleInfo: {
        type: String,
        required: false
    },
    vehicleNumber: {
        type: String,
        required: false
    },
    rideDetails: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ride', RideSchema);
