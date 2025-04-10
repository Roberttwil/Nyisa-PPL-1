const express = require('express');
const { Op } = require('sequelize');
const { Restaurant } = require('../models');

const router = express.Router();

router.get('/cards', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        // Filter by multiple restaurant types
        if (req.query.type) {
            const types = req.query.type.split(',');
            filters.restaurant_type = { [Op.in]: types };
        }
        
        // Filter by min rating
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

module.exports = router;
