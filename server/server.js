// server/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testDbConnection } = require('./config/db');

const authRoutes = require('./routes/auth'); // Auth routes for signup/login
const transactionRoutes = require('./routes/transactions'); // New transaction routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on server start
testDbConnection();

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use transaction routes (protected by authMiddleware within the routes/transactions.js file)
app.use('/api/transactions', transactionRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
