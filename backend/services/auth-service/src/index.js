const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('./config');
const { connectDB } = require('./config/database');
const { setupRabbitMQ } = require('./config/rabbitmq');
const { setupRedis } = require('./config/redis');
const { logger } = require('./utils/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info('Connected to MongoDB');

    // Connect to Redis
    await setupRedis();
    logger.info('Connected to Redis');

    // Connect to RabbitMQ
    await setupRabbitMQ();
    logger.info('Connected to RabbitMQ');

    // Start Express server
    app.listen(config.port, () => {
      logger.info(`Auth service running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer(); 