const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection function
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/research-platform';
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/projects', require('../server/routes/projects'));
app.use('/api/applications', require('../server/routes/applications'));
app.use('/api/users', require('../server/routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Serverless function handler
module.exports = async (req, res) => {
  // Connect to database on each request (Vercel will cache the connection)
  await connectDB();
  
  // Handle the request
  app(req, res);
};
