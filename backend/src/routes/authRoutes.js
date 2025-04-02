const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendOTP = require('../utils/mailer');
const { Users } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const exists = await Users.findByPk(username);
        if (exists) return res.status(400).json({ message: 'User exists' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const newUser = await Users.create({
            username,
            password,
            otp,
            otp_expires_at: otpExpires
        });

        await sendOTP(email, otp); // Send OTP to user's email

        res.status(201).json({
            message: 'OTP sent to your email. Please verify to complete registration.'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findByPk(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});


router.post('/verify-otp', async (req, res) => {
    const { username, otp } = req.body;

    const user = await Users.findByPk(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > user.otp_expires_at) return res.status(400).json({ message: 'OTP expired' });

    // Clear OTP after use
    user.otp = null;
    user.otp_expires_at = null;
    await user.save();

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});


module.exports = router;