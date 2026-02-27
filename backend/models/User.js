const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        sparse: true,
        unique: true
    },
    email: {
        type: String,
        sparse: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'driver', 'admin'],
        default: 'user'
    },
    rating: {
        type: Number,
        default: 0
    },
    totalTrips: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
