const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// @route   POST api/bookings
// @desc    Book a seat
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { rideId, paymentMethod, pricePaid } = req.body;

        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ msg: 'Ride not found' });
        }

        // Check if full
        if (ride.seatsBooked >= ride.seatsOffered) {
            return res.status(400).json({ msg: 'Ride is fully booked' });
        }

        // Self-booking check (optional)
        if (ride.driver.toString() === req.user.id) {
            // This depends on the application's rules, commonly drivers cannot book their own ride
        }

        const newBooking = new Booking({
            ride: rideId,
            passenger: req.user.id,
            driver: ride.driver,
            paymentMethod,
            pricePaid,
            status: 'Upcoming'
        });

        const booking = await newBooking.save();

        // Increase booked seats in the ride model
        ride.seatsBooked += 1;
        await ride.save();

        res.status(201).json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bookings/my-bookings
// @desc    Get passenger's bookings
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
    try {
        // Pulls bookings where user is the passenger
        const bookings = await Booking.find({ passenger: req.user.id })
            .populate('driver', 'name phone rating')
            .populate('ride', 'from to date time mode vehicleInfo vehicleNumber status');

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
