const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Users, User } = require('../models');
const { sendOTP } = require('../utils/mailer');

const router = express.Router();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    try {
        const { email, displayName } = req.user;
        let user = await Users.findOne({ where: { username: email } });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

        // USER BARU
        if (!user) {
            console.log("Creating profile with:", { email, displayName });
            user = await Users.create({
                username: email,
                password: 'social', // dummy
                otp,
                otp_expires_at: otpExpires,
                is_verified: false
            });

            const existingProfile = await User.findOne({ where: { username: email } });
            if (!existingProfile) {
                await User.create({
                    username: email,
                    name: displayName,
                    phone: '',
                    email: email,
                    address: '',
                    status: 0
                });
            }

            await sendOTP(email, otp);
            return res.redirect(
                `http://localhost:5173/verif-otp?username=${encodeURIComponent(email)}&email=${encodeURIComponent(email)}`
            );
        }

        // USER BELUM VERIFIKASI
        if (!user.is_verified) {
            user.otp = otp;
            user.otp_expires_at = otpExpires;
            await user.save();
            await sendOTP(email, otp);
            return res.redirect(
                `http://localhost:5173/verif-otp?username=${encodeURIComponent(email)}&email=${encodeURIComponent(email)}`
            );
        }

        // USER VERIFIED → ISSUE TOKEN
        const profile = await User.findOne({ where: { username: user.username } });
        const role = profile?.status === 1 ? 'restaurant' : 'user';

        const token = jwt.sign(
            { username: user.username, user_id: profile.user_id, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.redirect(
            `http://localhost:5173/social-auth-success?token=${token}`
        );
    } catch (err) {
        console.error('Google callback error:', err);
        return res.redirect(
            `http://localhost:5173/social-auth-success?error=${encodeURIComponent(
                'Login failed'
            )}`
        );
    }
}
);

// Facebook Auth
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), async (req, res) => {
//     const { email } = req.user;
//     let user = await Users.findOne({ where: { username: email } });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

//     if (!user) {
//         user = await Users.create({
//             username: email,
//             password: 'social',
//             otp,
//             otp_expires_at: otpExpires,
//             is_verified: false
//         });
//         await sendOTP(email, otp);
//         return res.json({ message: 'OTP sent to your email. Please verify.' });
//     }

//     if (!user.is_verified) {
//         user.otp = otp;
//         user.otp_expires_at = otpExpires;
//         await user.save();
//         await sendOTP(email, otp);
//         return res.json({ message: 'Account not verified. New OTP sent.' });
//     }

//     const token = jwt.sign({ username: user.username, user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
// });

module.exports = router;
