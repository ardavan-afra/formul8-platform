const connectDB = require('./db');

// Common middleware for all API routes
const withDB = (handler) => {
  return async (req, res) => {
    try {
      await connectDB();
      return handler(req, res);
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ message: 'Database connection failed' });
    }
  };
};

module.exports = { withDB };
