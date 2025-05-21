const express = require('express');
const { Transaction, Food, Restaurant, User } = require('../models');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// PUT /api/user/profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const username = req.user.username;
        const { name, phone, email, address } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Update only if values are provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (email) user.email = email;
        if (address) user.address = address;

        await user.save();

        res.json({ message: 'Profile updated successfully', profile: user });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});


router.get('/profile', authenticate, async (req, res) => {
    try {
        const username = req.user.username;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json({ profile: user });
    } catch (err) {
        console.error('Fetch profile error:', err);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

router.get('/transactions', authenticate, async (req, res) => {
    try {
        console.log('req.user:', req.user);
        const user_id = req.user.user_id;

        const transactions = await Transaction.findAll({
            where: { user_id },
            include: [
                {
                    model: Food,
                    as: 'food',
                    attributes: ['name', 'type', 'photo', 'price']
                },
                {
                    model: Restaurant,
                    as: 'restaurant',
                    attributes: ['name', 'restaurant_type', 'restaurant_id']
                }
            ],
            order: [['date', 'DESC']]
        });

        if (!transactions.length) {
            return res.status(404).json({ message: 'No transactions found.' });
        }

        const formatted = transactions.map(tx => ({
            transaction_id: tx.transaction_id,
            food_id: tx.food_id,
            booking_code: tx.booking_code,
            total: tx.total,
            status: tx.status,
            date: tx.date,
            food: tx.food,
            restaurant: tx.restaurant
        }));

        res.json({ transactions: formatted });
    } catch (err) {
        console.error('Fetch transactions error:', err);
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});

router.get('/last-transaction-food', authenticate, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const lastTransaction = await Transaction.findOne({
            where: { user_id },
            include: [
                {
                    model: Food,
                    as: 'food',
                    attributes: ['food_id', 'name', 'photo', 'type', 'price']
                }
            ],
            order: [['date', 'DESC']]
        });

        if (!lastTransaction) {
            return res.status(404).json({ error: 'No transactions found.' });
        }

        res.json({
            food_id: lastTransaction.food_id,
            food: lastTransaction.food
        });
    } catch (error) {
        console.error('Error fetching last transaction:', error);
        res.status(500).json({ error: 'Failed to get last transaction' });
    }
});


module.exports = router;
