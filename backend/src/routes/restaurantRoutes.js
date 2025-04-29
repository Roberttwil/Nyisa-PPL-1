const express = require('express');
const axios = require('axios');
const { Op } = require('sequelize');
const { Restaurant, User } = require('../models');
const { authenticate, restaurantOnly } = require('../middleware/authMiddleware');
const { upload, resizeAndUpload } = require('../utils/s3SharpUploader');

const router = express.Router();

router.get('/cards', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        // Search by name
        if (req.query.search) {
            filters.name = { [Op.like]: `%${req.query.search}%` };
        }

        // Filter by multiple restaurant types
        if (req.query.type) {
            const types = req.query.type.split(',');
            filters.restaurant_type = { [Op.in]: types };
        }

        // Filter by minimum rating
        if (req.query.minRating) {
            filters.rating = { [Op.gte]: parseFloat(req.query.minRating) };
        }

        const { count, rows } = await Restaurant.findAndCountAll({
            where: filters,
            attributes: ['restaurant_id', 'name', 'photo', 'rating', 'restaurant_type', 'latitude', 'longitude'],
            limit,
            offset
        });

        const formatted = rows.map(r => ({
            id: r.restaurant_id,
            name: r.name,
            photo: r.photo,
            rating: r.rating,
            type: r.restaurant_type,
            location: {
                lat: r.latitude,
                lng: r.longitude
            }
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            data: formatted
        });
    } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        res.status(500).json({ message: 'Could not fetch restaurants' });
    }
});


// PUT /api/restaurant/profile
router.put('/profile', authenticate, restaurantOnly, upload.single('photo'), async (req, res) => {
    try {
        const username = req.user.username;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const restaurant = await Restaurant.findOne({ where: { email: user.email } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const {
            name, type, address, phone,
            email, rating
        } = req.body;

        // Optional photo upload
        if (req.file) {
            const photoUrl = await resizeAndUpload(req.file, 'restaurant');
            restaurant.photo = photoUrl;
        }

        // Convert address to lat/lng (if address is provided)
        if (address) {
            restaurant.address = address;

            const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            const geoData = geoRes.data;
            if (geoData.status === 'OK' && geoData.results.length > 0) {
                const location = geoData.results[0].geometry.location;
                restaurant.latitude = location.lat;
                restaurant.longitude = location.lng;
            } else {
                return res.status(400).json({ message: 'Invalid address. Could not resolve coordinates.' });
            }
        }

        if (name) restaurant.name = name;
        if (type) restaurant.restaurant_type = type;
        if (phone) restaurant.phone = phone;
        if (email) restaurant.email = email;
        if (rating) restaurant.rating = rating;

        await restaurant.save();

        res.json({ message: 'Restaurant profile updated successfully', restaurant });
    } catch (err) {
        console.error('Restaurant profile update error:', err);
        res.status(500).json({ message: 'Failed to update restaurant profile' });
    }
});

module.exports = router;
