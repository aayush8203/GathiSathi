const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Login or Register user via Phone Number or Email (Mock OTP flow)
// @access  Public
router.post('/login', async (req, res) => {
    const { phone, email } = req.body;

    if (!phone && !email) {
        return res.status(400).json({ msg: 'Please enter a phone number or email' });
    }

    try {
        let query = {};
        if (phone) query.phone = phone;
        if (email) query.email = email;

        // Check if user exists
        let user = await User.findOne(query);

        // If no user, mock a silent registration for seamless onboarding
        if (!user) {
            user = new User(query);
            await user.save();
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' }, // 30 days token
            (err, token) => {
                if (err) throw err;
                res.json({ token, user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
