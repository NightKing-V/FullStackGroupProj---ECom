const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConn');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, Express API is running!' });
});

// Auth routes
app.use('/api/v1/auth', authRoutes);

// User routes
app.use('/api/v1/users', userRoutes);

// Product routes
app.use('/api/v1/products', productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
