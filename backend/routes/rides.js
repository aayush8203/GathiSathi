const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Ride = require('../models/Ride');
const User = require('../models/User');

// @route   GET api/rides
// @desc    Get all active rides based on filters (from, to, mode)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { from, to, mode, date } = req.query;
        let query = { status: 'Active' };

        // Simple filtering
        if (from) query.from = new RegExp(from, 'i');
        if (to) query.to = new RegExp(to, 'i');
        if (mode) query.mode = mode;
        if (date) query.date = { $gte: new Date(date) };

        // Fetch rides directly populated with public Driver info
        const rides = await Ride.find(query)
            .populate('driver', 'name phone rating totalTrips isVerified')
            .sort({ date: 1 });

        res.json(rides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/rides
// @desc    Publish a newly offered Ride
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { mode, from, to, date, time, price, seatsOffered, vehicleInfo, vehicleNumber, rideDetails } = req.body;

        const newRide = new Ride({
            driver: req.user.id,
            mode,
            from,
            to,
            date,
            time,
            price,
            seatsOffered,
            vehicleInfo,
            vehicleNumber,
            rideDetails
        });

        const ride = await newRide.save();

        // Increment the user's total trips as a host
        await User.findByIdAndUpdate(req.user.id, { $inc: { totalTrips: 1 } });

        res.status(201).json(ride);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/rides/my-rides
// @desc    Get rides offered by the logged in driver
// @access  Private
router.get('/my-rides', auth, async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.user.id })
            .sort({ date: -1 });

        res.json(rides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/rides/:id
// @desc    Get a single ride by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('driver', 'name phone rating totalTrips isVerified');

        if (!ride) return res.status(404).json({ msg: 'Ride not found' });

        res.json(ride);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Ride not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
