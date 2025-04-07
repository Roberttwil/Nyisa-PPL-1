const express = require('express')
const router = express.Router()
const { Cart, Transaction, Food } = require('../models')

function generateBookingCode(length) {
    let result = '';
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const charLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }

    return result;
}

router.post('/add/cart', async (req, res) => {
    try {
        const { booking_code, user_id, food_id} = req.body;

        if (!booking_code || !user_id || !food_id) {
            return res.status(400).json({ error: 'Semua field harus diisi: booking_code, user_id, food_id' });
        }

        const food = await Food.findByPk(food_id, { attributes: ['restaurant_id'] });

        const newCartItem = await Cart.create({
            booking_code,
            user_id,
            restaurant_id: food.restaurant_id,
            food_id
        });

        res.status(201).json({ message: "Tambah ke Cart Berhasil", cartItem: newCartItem })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/remove/cart', async (req, res) => {
    try {
        const { booking_code, food_id } = req.body;

        await Cart.destroy({ where: { booking_code, food_id } });

        res.status(201).json({ message: "Hapus Item dari Cart berhasil", cartItem: { booking_code, food_id } })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post('/book', async (req, res) => {
    try {
        const { booking_code } = req.body;
        let total = 0;

        const cartItems = await Cart.findAll({ where: { booking_code } });

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No Items Found' })
        }

        const prices = await Promise.all(
            cartItems.map(async (item) => {
                const food = await Food.findByPk(item.food_id, { attributes: ['price'] });
                return food ? food.price : 0;
            })
        )

        total = prices.reduce((sum, price) => sum + price, 0);

        await Promise.all(
            cartItems.map(async (item) => {
                await Transaction.create({
                    booking_code,
                    user_id: item.user_id,
                    restaurant_id: item.restaurant_id,
                    food_id: item.food_id,
                    total,
                    status: 0,
                    date: new Date()
                });
            })
        );

        await Cart.destroy({ where: { booking_code } })

        res.status(201).json({ message: "Booking Berhasil", total })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/booking-code', async (req, res) => {
    try {
        bookingCode = generateBookingCode(6);
        
        res.status(200).json({bookingCode: bookingCode});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router