const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware — allow requests from Vercel frontend and localhost
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://gathi-sathi.vercel.app',
    process.env.FRONTEND_URL // extra override if needed
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to GatiSathi API 🚀' });
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;

// Only listen when running directly (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

module.exports = app;
