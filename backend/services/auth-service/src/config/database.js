const mongoose = require('mongoose');
const { config } = require('./index');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      process.exit(1);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { connectDB }; 