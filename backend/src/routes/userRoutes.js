const express = require('express');
const { User } = require('../models');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// PUT /api/user/profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const username = req.user.username;
        const { name, phone, email, address } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Update only if values are provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (email) user.email = email;
        if (address) user.address = address;

        await user.save();

        res.json({ message: 'Profile updated successfully', profile: user });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

module.exports = router;
