require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const sequelize = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const authenticate = require('./src/middleware/authMiddleware');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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