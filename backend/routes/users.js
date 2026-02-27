const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');

// @route   GET api/users/me
// @desc    Get Current Logged in User 
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-__v');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/profile
// @desc    Update user profile (Name, Role update)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { name, phone } = req.body;

    // Build user object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (phone) profileFields.phone = phone; // Though changing phone numbers is rare/complex

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update
        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        ).select('-__v');

        res.json({ msg: "Profile updated successfully", user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
