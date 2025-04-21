const express = require('express');
const { authenticate, restaurantOnly } = require('../middleware/authMiddleware');
const { User, Restaurant, Food } = require('../models');
const { upload, resizeAndUpload } = require('../utils/s3SharpUploader');

const router = express.Router();


// Upload user profile photo
router.put('/user-photo', authenticate, upload.single('photo'), async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const photo = await resizeAndUpload(req.file, 'users');
        user.photo = photo;
        await user.save();

        res.json({ message: 'User photo uploaded successfully', photo });
    } catch (err) {
        console.error('Upload error (user):', err);
        res.status(500).json({ message: 'Upload failed' });
    }
});


// Upload restaurant photo
router.put('/restaurant-photo', authenticate, restaurantOnly, upload.single('photo'), async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.user.username } });
        const restaurant = await Restaurant.findOne({ where: { email: user.email } });

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const photo = await resizeAndUpload(req.file, 'restaurants');
        restaurant.photo = photo;
        await restaurant.save();

        res.json({ message: 'Restaurant photo uploaded successfully', photo });
    } catch (err) {
        console.error('Upload error (restaurant):', err);
        res.status(500).json({ message: 'Upload failed' });
    }
});


// Upload food photo
router.put('/food-photo/:id', authenticate, restaurantOnly, upload.single('photo'), async (req, res) => {
    try {
        const food = await Food.findByPk(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });

        const photo = await resizeAndUpload(req.file, 'foods');
        food.photo = photo;
        await food.save();

        res.json({ message: 'Food photo uploaded successfully', photo });
    } catch (err) {
        console.error('Upload error (food):', err);
        res.status(500).json({ message: 'Upload failed' });
    }
});

module.exports = router;
