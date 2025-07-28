const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../Backend/config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import routes
const authRoutes = require('../Backend/Routes/authRoutes');
const orderRoutes = require('../Backend/Routes/orderRoutes');
const productRoutes = require('../Backend/Routes/productRoutes');
const cartRoutes = require('../Backend/Routes/cartRoutes'); 
const reviewRoutes = require('../Backend/Routes/reviewRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/review', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = app;
