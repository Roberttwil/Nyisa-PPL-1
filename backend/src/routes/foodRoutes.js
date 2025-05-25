const express = require('express');
const { Op } = require('sequelize');
const { Food, Restaurant, User } = require('../models');
const { authenticate, restaurantOnly } = require('../middleware/authMiddleware');
const { upload, resizeAndUpload } = require('../utils/s3SharpUploader');
const axios = require('axios');
const sequelize = require('../config/db')

const router = express.Router();

// Get restaurant_id by logged-in user
const getRestaurantId = async (username) => {
    const user = await User.findOne({ where: { username } });
    const restaurant = await Restaurant.findOne({ where: { email: user.email } });
    return restaurant?.restaurant_id;
};

router.get('/cards', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        // for filtering by restaurant ID
        if (req.query.restaurant_id) {
            filters.restaurant_id = req.query.restaurant_id;
        }

        // Filter by food name
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
            attributes: ['food_id', 'name', 'photo', 'type', 'price', 'promo_price', 'quantity', 'restaurant_id'],
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
            promo_price: f.promo_price || null,
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

// POST /api/foods -> add food
router.post('/', authenticate, restaurantOnly, upload.single('photo'), async (req, res) => {
    try {
        const restaurant_id = await getRestaurantId(req.user.username);
        const { name, type, price, promo_price, quantity } = req.body;

        let photoUrl = null;
        if (req.file) {
            photoUrl = await resizeAndUpload(req.file, 'foods');
        }

        const newFood = await Food.create({
            name,
            type,
            price,
            promo_price,
            photo: photoUrl,
            quantity,
            restaurant_id
        });

        const restaurant = await Restaurant.findOne({ where: { restaurant_id } });

        if (restaurant) {
            await sequelize.query(`
                INSERT INTO recommendation_data (
                    food_id, name, type, price,
                    restaurant, restaurant_type,
                    rating, longitude, latitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name = VALUES(name)
            `, {
                replacements: [
                    newFood.food_id,
                    newFood.name,
                    newFood.type,
                    newFood.promo_price,
                    restaurant.name,
                    restaurant.restaurant_type,
                    restaurant.rating,
                    restaurant.longitude,
                    restaurant.latitude
                ]
            });
        }

        await axios.post(`http://127.0.0.1:8000/api/foods/recommend/refresh`, {}, {
            headers: {
                Authorization: `Bearer ${process.env.RECSYS_SECRET}`
            }
        });

        res.status(201).json({ message: 'Food added successfully', food: newFood });
    } catch (err) {
        console.error('Add food error:', err);
        res.status(500).json({ message: 'Failed to add food' });
    }
});

// PUT /api/foods/:id -> update food
router.put('/:id', authenticate, restaurantOnly, upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant_id = await getRestaurantId(req.user.username);
        const food = await Food.findOne({ where: { food_id: id, restaurant_id } });

        if (!food) return res.status(404).json({ message: 'Food not found' });

        const { name, type, price, quantity, promo_price } = req.body;

        if (name) food.name = name;
        if (type) food.type = type;
        if (price) food.price = price;
        if (promo_price !== undefined) food.promo_price = promo_price;
        if (quantity) food.quantity = quantity;

        if (req.file) {
            const photoUrl = await resizeAndUpload(req.file, 'foods');
            food.photo = photoUrl;
        }

        await food.save();

        const restaurant = await Restaurant.findOne({ where: { restaurant_id } });

        if (restaurant) {
            await Food.sequelize.query(`
                INSERT INTO recommendation_data (
                    food_id, name, type, price,
                    restaurant, restaurant_type,
                    rating, longitude, latitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                type = VALUES(type),
                price = VALUES(price),
                restaurant = VALUES(restaurant),
                restaurant_type = VALUES(restaurant_type),
                rating = VALUES(rating),
                longitude = VALUES(longitude),
                latitude = VALUES(latitude)
            `, {
                replacements: [
                food.food_id,
                food.name,
                food.type,
                food.promo_price,
                restaurant.name,
                restaurant.restaurant_type,
                restaurant.rating,
                restaurant.longitude,
                restaurant.latitude
                ]
            });
        }

        await axios.post(`http://127.0.0.1:8000/api/foods/recommend/refresh`, {}, {
            headers: {
                Authorization: `Bearer ${process.env.RECSYS_SECRET}`
            }
        });

        res.json({ message: 'Food updated successfully', food });
    } catch (err) {
        console.error('Update food error:', err);
        res.status(500).json({ message: 'Failed to update food' });
    }
});

// DELETE /api/foods/:id -> delete FOOD ceritanya
router.delete('/:id', authenticate, restaurantOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant_id = await getRestaurantId(req.user.username);
        const food = await Food.findOne({ where: { food_id: id, restaurant_id } });

        if (!food) return res.status(404).json({ message: 'Food not found' });

        await food.destroy();
        
        await Food.sequelize.query(
            'DELETE FROM recommendation_data WHERE food_id = ?',
            { replacements: [food.food_id] }
        );

        await axios.post(`http://127.0.0.1:8000/api/foods/recommend/refresh`, {}, {
            headers: {
                Authorization: `Bearer ${process.env.RECSYS_SECRET}`
            }
        });

        res.json({ message: 'Food deleted successfully' });
    } catch (err) {
        console.error('Delete food error:', err);
        res.status(500).json({ message: 'Failed to delete food' });
    }
});

router.get('/recommend/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/foods/recommend/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Recommendation service failed' });
    }
});

module.exports = router;