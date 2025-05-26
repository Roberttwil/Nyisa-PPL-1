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
                    newFood.promo_price ?? newFood.price,
                    restaurant.name,
                    restaurant.restaurant_type,
                    restaurant.rating,
                    restaurant.longitude,
                    restaurant.latitude
                ]
            });
            console.log('Recommendation data updated successfully');
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
        console.log('=== UPDATE FOOD DEBUG ===');
        console.log('Food ID:', req.params.id);
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        
        const { id } = req.params;
        const restaurant_id = await getRestaurantId(req.user.username);
        
        console.log('Restaurant ID:', restaurant_id);
        
        const food = await Food.findOne({ where: { food_id: id, restaurant_id } });

        if (!food) {
            console.log('Food not found');
            return res.status(404).json({ message: 'Food not found' });
        }

        console.log('Current food data:', food.toJSON());

        const { name, type, price, quantity, promo_price } = req.body;

        // Update fields only if they are provided
        if (name !== undefined && name !== '') food.name = name;
        if (type !== undefined && type !== '') food.type = type;
        if (price !== undefined && price !== '') food.price = parseFloat(price);
        if (quantity !== undefined && quantity !== '') food.quantity = parseInt(quantity);
        if (promo_price !== undefined) {
            food.promo_price = promo_price === '' ? null : parseFloat(promo_price);
        }

        // Handle photo upload
        if (req.file) {
            console.log('Processing new photo upload...');
            try {
                const photoUrl = await resizeAndUpload(req.file, 'foods');
                food.photo = photoUrl;
                console.log('New photo URL:', photoUrl);
            } catch (uploadError) {
                console.error('Photo upload error:', uploadError);
                return res.status(500).json({ message: 'Failed to upload photo' });
            }
        }

        // Save the updated food
        await food.save();
        console.log('Food saved successfully');

        // Update recommendation data
        try {
            const restaurant = await Restaurant.findOne({ where: { restaurant_id } });
            
            if (restaurant) {
                console.log('Updating recommendation data...');
                
                await sequelize.query(`
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
                        food.promo_price ?? food.price,
                        restaurant.name,
                        restaurant.restaurant_type,
                        restaurant.rating,
                        restaurant.longitude,
                        restaurant.latitude
                    ]
                });
                
                console.log('Recommendation data updated successfully');
            }
        } catch (recommendationError) {
            console.error('Recommendation update error:', recommendationError);
            // Don't fail the whole request if recommendation update fails
        }
        await axios.post(`http://127.0.0.1:8000/api/foods/recommend/refresh`, {}, {
            headers: {
                Authorization: `Bearer ${process.env.RECSYS_SECRET}`
            }
        });
        console.log('Food updated successfully');
        res.json({ message: 'Food updated successfully', food: food.toJSON() });
        
    } catch (err) {
        console.error('=== UPDATE FOOD ERROR ===');
        console.error('Error details:', err);
        console.error('Stack trace:', err.stack);
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

router.get('/recommend/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/foods/recommend/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Recommendation service failed' });
    }
});

module.exports = router;