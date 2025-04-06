const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const sendOTP = require('../utils/mailer');

const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    const { email, username } = req.user; // comes from Passport

    let user = await Users.findOne({ where: { username: email } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
        // new social user
        user = await Users.create({
            username: email,
            password: 'social', // placeholder, unused
            otp,
            otp_expires_at: otpExpires,
            is_verified: false
        });
        await sendOTP(email, otp);
        return res.json({ message: 'OTP sent to your email. Please verify.' });
    }

    if (!user.is_verified) {
        user.otp = otp;
        user.otp_expires_at = otpExpires;
        await user.save();
        await sendOTP(email, otp);
        return res.json({ message: 'Account not verified. New OTP sent.' });
    }

    // verified user → issue token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), async (req, res) => {
    const { email } = req.user;
    let user = await Users.findOne({ where: { username: email } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
        user = await Users.create({
            username: email,
            password: 'social',
            otp,
            otp_expires_at: otpExpires,
            is_verified: false
        });
        await sendOTP(email, otp);
        return res.json({ message: 'OTP sent to your email. Please verify.' });
    }

    if (!user.is_verified) {
        user.otp = otp;
        user.otp_expires_at = otpExpires;
        await user.save();
        await sendOTP(email, otp);
        return res.json({ message: 'Account not verified. New OTP sent.' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
