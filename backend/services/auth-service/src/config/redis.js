const { createClient } = require('redis');
const { config } = require('./index');
const { logger } = require('../utils/logger');

let redisClient;

const setupRedis = async () => {
  try {
    redisClient = createClient({
      url: `redis://:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

module.exports = { setupRedis, getRedisClient }; 