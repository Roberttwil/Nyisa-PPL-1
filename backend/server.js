require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const app = express();

const sequelize = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
// const socialAuthRoutes = require('./src/routes/socialAuthsRoutes');
const orderRoutes = require('./src/routes/orderRoutes')
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const foodRoutes = require('./src/routes/foodRoutes');
const userRoutes = require('./src/routes/userRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const { authenticate } = require('./src/middleware/authMiddleware');

require('./src/config/passport');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/auth/social', socialAuthRoutes);
app.use('/api/order', orderRoutes)
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/protected', authenticate, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}! You have access.` });
});


(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database');

        await sequelize.sync();
        console.log('Models synchronized');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use.`);
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.error('Database connection failed:', error);
    }
})();