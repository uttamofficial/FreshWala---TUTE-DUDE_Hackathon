const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import the CORS package
const app = express();

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],  // Allow requests from specific frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  credentials: true,  // Allow cookies to be sent/received
};

app.use(cors(corsOptions));  // Apply the CORS policy

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/review', reviewRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
