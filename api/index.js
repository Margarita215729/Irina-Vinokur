const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth');
const artworkRoutes = require('./routes/artworks');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
}));

app.use(cors({
    origin: process.env.CLIENT_URL || 'https://irina-vinokur-n75khye55-makeeva01m-gmailcoms-projects.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes - убираем префикс /api так как он уже в URL
app.use('/auth', authRoutes);
app.use('/artworks', artworkRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running on Vercel' });
});

// Root handler
app.get('/', (req, res) => {
    res.json({ message: 'Irina Vinokur Portfolio API', status: 'OK' });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

module.exports = app;
