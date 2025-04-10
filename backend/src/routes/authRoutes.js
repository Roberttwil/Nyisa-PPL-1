const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Users } = require('../models');
const sendOTP = require('../utils/mailer');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existing = await Users.findByPk(username);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // If username is already used and verified → block registration
        if (existing && existing.is_verified) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // If user exists but is not verified → resend OTP, update password
        if (existing && !existing.is_verified) {
            existing.password = password; // will be hashed by hook
            existing.otp = otp;
            existing.otp_expires_at = otpExpires;
            await existing.save();

            await sendOTP(email, otp);

            return res.status(200).json({
                message: "You already registered but haven't verified. A new OTP has been sent to your email."
            });
        }

        // New registration
        await Users.create({
            username,
            password,
            otp,
            otp_expires_at: otpExpires,
            is_verified: false
        });

        await sendOTP(email, otp);

        res.status(201).json({
            message: 'OTP sent to your email. Please verify to complete registration.'
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findByPk(username);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Account not verified. Please check your email for OTP.' });
        }

        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// VERIFY REGISTRATION OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { username, otp } = req.body;
        const user = await Users.findByPk(username);

        if (!user || !user.otp || !user.otp_expires_at) {
            return res.status(404).json({ message: 'OTP not found or already used' });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > user.otp_expires_at) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.otp = null;
        user.otp_expires_at = null;
        user.is_verified = true;
        await user.save();

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'OTP verification failed' });
    }
});

// RESEND OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await Users.findByPk(username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otp_expires_at = expires;
        await user.save();

        await sendOTP(email, otp);
        res.json({ message: 'OTP resent to your email' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

// FORGOT PASSWORD - SEND OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await Users.findByPk(username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otp_expires_at = expires;
        await user.save();

        await sendOTP(email, otp);
        res.json({ message: 'Password reset OTP sent to your email.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send reset OTP' });
    }
});

// VERIFY RESET OTP
router.post('/verify-reset-otp', async (req, res) => {
    try {
        const { username, otp } = req.body;
        const user = await Users.findByPk(username);

        if (!user || !user.otp || !user.otp_expires_at) {
            return res.status(404).json({ message: 'OTP not found' });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > user.otp_expires_at) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // JWT for token
        const token = jwt.sign(
            { username: user.username, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.json({
            message: 'OTP verified. You may now reset your password.',
            token
        });
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(500).json({ error: 'Failed to verify reset OTP' });
    }
});

// RESET PASSWORD
router.post('/reset-password', verifyResetToken, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await Users.findByPk(req.username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword;
        user.otp = null;
        user.otp_expires_at = null;
        await user.save();

        res.json({ message: 'Password successfully reset.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
});


module.exports = router;