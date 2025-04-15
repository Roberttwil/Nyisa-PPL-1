const express = require('express');
const { Op } = require('sequelize');
const { Food, Restaurant } = require('../models');

const router = express.Router();

router.get('/cards', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        // Search by food name
        if (req.query.search) {
            filters.name = { [Op.like]: `%${req.query.search}%` };
        }

        // Filter by food type
        if (req.query.type) {
            const types = req.query.type.split(',');
            filters.type = { [Op.in]: types };
        }

        // Filter by price range
        if (req.query.minPrice) {
            filters.price = { [Op.gte]: parseFloat(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            filters.price = {
                ...filters.price,
                [Op.lte]: parseFloat(req.query.maxPrice)
            };
        }

        const { count, rows } = await Food.findAndCountAll({
            where: filters,
            attributes: ['food_id', 'name', 'photo', 'type', 'price', 'quantity', 'restaurant_id'],
            limit,
            offset,
            include: [
                {
                    model: Restaurant,
                    attributes: ['name'],
                    as: 'restaurant'
                }
            ]
        });

        const formatted = rows.map(f => ({
            id: f.food_id,
            name: f.name,
            photo: f.photo,
            type: f.type,
            price: f.price,
            quantity: f.quantity,
            restaurantName: f.restaurant?.name || null
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            data: formatted
        });
    } catch (err) {
        console.error('Failed to fetch food cards:', err);
        res.status(500).json({ message: 'Could not fetch foods' });
    }
});

module.exports = router;
