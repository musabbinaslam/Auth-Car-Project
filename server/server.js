require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const AppError = require('./utils/errors');
const carRoutes = require('./routes/cars');
const rentalRoutes = require('./routes/rentals');
const reviewRoutes = require('./routes/review');
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/reviews', reviewRoutes);



// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
});

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Car Rental API is running' });
});

// Favicon Fix
app.get('/favicon.ico', (req, res) => res.status(204));

// Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Initial check for expired rentals
    try {
        const rentalService = require('./services/rentalService');
        const count = await rentalService.checkExpiredRentals();
        console.log(`Checked expired rentals on startup. Updated: ${count}`);
    } catch (err) {
        console.error('Error checking expired rentals on startup:', err);
    }

    // Schedule check every hour (3600000 ms)
    setInterval(async () => {
        try {
            const rentalService = require('./services/rentalService');
            const count = await rentalService.checkExpiredRentals();
            if (count > 0) console.log(`Auto-completed ${count} rentals.`);
        } catch (err) {
            console.error('Error in scheduled rental check:', err);
        }
    }, 3600000);
});
