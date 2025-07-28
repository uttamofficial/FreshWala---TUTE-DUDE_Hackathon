const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import the CORS package
const app = express();

const authRoutes = require('./Routes/authRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes'); 
const reviewRoutes = require('./Routes/reviewRoutes');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['https://fresh-wala-tute-dude-hackathon-2fde8tp7v-uk1619s-projects.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));  // Apply the CORS policy

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/review', reviewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running on Vercel!' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
