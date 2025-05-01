const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const { Users, User, Restaurant } = require('../models');
const sendOTP = require('../utils/mailer');
const { verifyResetToken } = require('../middleware/authMiddleware');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;

        if (!username || !password || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required: username, password, email, phone.' });
        }

        const existing = await Users.findByPk(username);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // If user is verified → block registration
        if (existing && existing.is_verified) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // If user exists but not verified → resend OTP and update password
        if (existing && !existing.is_verified) {
            existing.password = password;
            existing.otp = otp;
            existing.otp_expires_at = otpExpires;
            await existing.save();

            await sendOTP(email, otp);

            return res.status(200).json({
                message: "You already registered but haven't verified. A new OTP has been sent to your email."
            });
        }

        // New user registration
        await Users.create({
            username,
            password,
            otp,
            otp_expires_at: otpExpires,
            is_verified: false
        });

        await User.create({
            username,
            name: username,  // autofill name
            phone,
            email,
            address: '',     // placeholder, update later
            status: 0        // default status 0 is for normal user, while 1 is for restaurant owner
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

        const profile = await User.findOne({ where: { username } });

        if (!profile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const role = profile.status === 1 ? 'restaurant' : 'user';

        const token = jwt.sign(
            { username: user.username, user_id: profile.user_id, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role });
    } catch (err) {
        console.error('Login error:', err);
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

        const userProfile = await User.findOne({ where: { username: user.username } });
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const token = jwt.sign(
            { username: user.username, user_id: userProfile.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
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


        user.otp = null;
        user.otp_expires_at = null;
        await user.save();

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

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otp_expires_at = null;
        await user.save();

        res.json({ message: 'Password successfully reset.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

router.post('/register-restaurant', async (req, res) => {
    try {
        const {
            username, password, email, phone,
            restaurantName, restaurantType, address
        } = req.body;

        if (!username || !password || !email || !phone || !restaurantName || !restaurantType || !address) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: { address, key: process.env.GOOGLE_MAPS_API_KEY }
        });

        const geoData = geoRes.data;
        if (geoData.status !== 'OK' || !geoData.results.length) {
            return res.status(400).json({ message: 'Invalid address. Failed to fetch coordinates.' });
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        const existing = await Users.findByPk(username);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        if (existing) {
            if (existing.is_verified) {
                return res.status(400).json({ message: 'Username is already taken' });
            }

            // Update user not verified
            existing.password = password;
            existing.otp = otp;
            existing.otp_expires_at = otpExpires;
            await existing.save();

            await sendOTP(email, otp);
            return res.status(200).json({ message: 'Account exists but not verified. OTP resent.' });
        }

        // Check duplicate email
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Start Registration Process
        await Users.create({
            username,
            password,
            otp,
            otp_expires_at: otpExpires,
            is_verified: false
        });

        await User.create({
            username,
            name: restaurantName,
            phone,
            email,
            address,
            status: 1
        });

        await Restaurant.create({
            name: restaurantName,
            phone,
            email,
            address,
            restaurant_type: restaurantType,
            photo: '',      // Bisa diset default di model
            rating: 0,      // Bisa diset default di model
            latitude: lat,
            longitude: lng
        });

        await sendOTP(email, otp);

        res.status(201).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
    } catch (err) {
        console.error('Restaurant registration error:', err.message);
        res.status(500).json({ message: 'Registration failed' });
    }
});


module.exports = router;