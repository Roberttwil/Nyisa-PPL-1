const express = require('express');
const axios = require('axios');
const { Op, where } = require('sequelize');
const { Food, Restaurant, User, Transaction } = require('../models');
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

// PUT /api/restaurants/profile
router.put('/profile', authenticate, restaurantOnly, upload.single('photo'), async (req, res) => {
    try {
        const username = req.user.username;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const restaurant = await Restaurant.findOne({ where: { email: user.email } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const { name, type, phone, email, address, rating } = req.body;

        console.log('Incoming data:', req.body);

        // Handle photo upload
        if (req.file) {
            const photoUrl = await resizeAndUpload(req.file, 'restaurant');
            restaurant.photo = photoUrl;
        }

        // Update location if address provided
        if (address) {
            restaurant.address = address;
            user.address = address;

            const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
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

        if (name) {
            restaurant.name = name;
            user.name = name;
        }
        if (type) restaurant.restaurant_type = type;

        if (phone) {
            restaurant.phone = phone;
            user.phone = phone;
        }

        if (email) {
            restaurant.email = email;
            user.email = email;
        }

        if (rating) restaurant.rating = rating;

        await user.save();
        await restaurant.save();

        res.json({ message: 'Restaurant profile updated successfully', restaurant });
    } catch (err) {
        console.error('Restaurant profile update error:', err);
        res.status(500).json({ message: 'Failed to update restaurant profile' });
    }
});

router.get('/profile/owner', authenticate, restaurantOnly, async (req, res) => {
    try {
        const username = req.user.username;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const restaurant = await Restaurant.findOne({ where: { email: user.email } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found for this user' });

        const ownerProfile = {
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            restaurant: {
                id: restaurant.restaurant_id,
                name: restaurant.name,
                type: restaurant.restaurant_type,
                photo: restaurant.photo,
                rating: restaurant.rating
            }
        };

        res.json({ owner: ownerProfile });
    } catch (err) {
        console.error('Failed to fetch owner profile:', err);
        res.status(500).json({ message: 'Failed to fetch owner profile' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const { search = "", lat, lng } = req.query;
        const filters = {};

        if (search) {
            filters.name = { [Op.like]: `%${search}%` };
        }

        const restaurants = await Restaurant.findAll({
            where: filters,
            attributes: [
                'restaurant_id',
                'name',
                'address',
                'latitude',
                'longitude',
                'photo',
                'rating'
            ],
            raw: true
        });

        let results = restaurants;

        // If lat/lng are provided, calculate distance
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);

            results = restaurants.map((r) => {
                const R = 6371; // Radius of Earth in km
                const dLat = (userLat - parseFloat(r.latitude)) * Math.PI / 180;
                const dLng = (userLng - parseFloat(r.longitude)) * Math.PI / 180;

                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(userLat * Math.PI / 180) *
                    Math.cos(parseFloat(r.latitude) * Math.PI / 180) *
                    Math.sin(dLng / 2) ** 2;

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c;

                return {
                    ...r,
                    distance
                };
            });

            // sort by distance
            results.sort((a, b) => a.distance - b.distance);
        }

        res.json(results);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/rate', authenticate, async (req, res) => {
    try {
        const { rating, restaurant_id } = req.body;

        if (!rating || !restaurant_id || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Invalid rating or missing fields' });
        }

        const restaurant = await Restaurant.findOne({ where: { restaurant_id: restaurant_id } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found for this user' });

        const rating_count = restaurant.rating * restaurant.user_rating_count;
        const new_user_count = restaurant.user_rating_count + 1;
        const new_rating = (rating_count + rating) / new_user_count;

        await Restaurant.update({
            rating: new_rating,
            user_rating_count: new_user_count
        }, { where: { restaurant_id: restaurant_id } });

        res.status(200).json({ message: "Rate Restaurant Berhasil", new_rating });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to rate restaurant' });
    }
})

router.get('/restaurant/transactions', authenticate, restaurantOnly, async (req, res) => {
    try {
        const restaurant_id = req.user.restaurant_id;

        const transactions = await Transaction.findAll({
            where: { restaurant_id },
            include: [
                {
                    model: Food,
                    as: 'food',
                    attributes: ['name', 'type', 'photo', 'price']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ],
            order: [['date', 'DESC']]
        });

        if (!transactions.length) {
            return res.status(404).json({ message: 'No transactions found for this restaurant' });
        }

        const formatted = transactions.map(tx => ({
            transaction_id: tx.transaction_id,
            booking_code: tx.booking_code,
            total: tx.total,
            status: tx.status,
            date: tx.date,
            food: tx.food,
            user: tx.user
        }));

        res.json({ transactions: formatted });
    } catch (err) {
        console.error('Fetch restaurant transactions error:', err);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});

module.exports = router;
