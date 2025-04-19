const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authenticate any logged-in user via JWT
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// Allow only restaurant users (status === 1)
exports.restaurantOnly = async (req, res, next) => {
    try {
        const { username } = req.user;
        const user = await User.findOne({ where: { username } });

        if (!user || user.status !== 1) {
            return res.status(403).json({ message: 'Access denied: Not a restaurant user' });
        }

        next();
    } catch (err) {
        console.error('restaurantOnly error:', err);
        res.status(500).json({ message: 'Internal error validating restaurant role' });
    }
};

// Middleware to verify password reset token with purpose
exports.verifyResetToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password-reset') {
            return res.status(403).json({ message: 'Invalid token purpose' });
        }
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};