/**
 * Auth Service Database Connection Module
 * Handles connections to Redis and MongoDB
 */

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const redis = require('redis');
const config = require('../config/database');

// MongoDB connection
let mongoClient = null;
let mongoDb = null;

// Redis connection
let redisClient = null;

/**
 * Initialize MongoDB connection
 */
async function connectMongoDB() {
  try {
    if (!mongoClient) {
      // MongoClient bağlantısı
      mongoClient = new MongoClient(config.mongodb.url, config.mongodb.options);
      await mongoClient.connect();
      mongoDb = mongoClient.db(config.mongodb.dbName);
      
      // Mongoose bağlantısı
      await mongoose.connect(`${config.mongodb.url}/${config.mongodb.dbName}`, config.mongodb.options);
      
      console.log('[Auth Service] MongoDB connection established successfully');
    }
    return mongoDb;
  } catch (error) {
    console.error('[Auth Service] MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Initialize Redis connection
 */
async function connectRedis() {
  try {
    if (!redisClient) {
      redisClient = redis.createClient({
        url: `redis://${config.redis.username}:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
        database: config.redis.db
      });

      // Redis error handling
      redisClient.on('error', (err) => {
        console.error('[Auth Service] Redis error:', err);
      });

      // Connect to Redis
      await redisClient.connect();
      console.log('[Auth Service] Redis connection established successfully');
    }
    return redisClient;
  } catch (error) {
    console.error('[Auth Service] Redis connection error:', error);
    throw error;
  }
}

/**
 * Close database connections
 */
async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      mongoDb = null;
      console.log('[Auth Service] MongoDB connection closed');
    }
    
    // Mongoose bağlantısını kapat
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('[Auth Service] Mongoose connection closed');
    }
    
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      console.log('[Auth Service] Redis connection closed');
    }
  } catch (error) {
    console.error('[Auth Service] Error closing database connections:', error);
    throw error;
  }
}

// MongoDB Collection Helpers
const getCollection = (collectionName) => {
  if (!mongoDb) {
    throw new Error('[Auth Service] MongoDB connection not established');
  }
  return mongoDb.collection(collectionName);
};

// Redis Key Helpers
const getUserSessionKey = (userId) => `auth:session:${userId}`;
const getRefreshTokenKey = (tokenId) => `auth:refresh:${tokenId}`;

module.exports = {
  connectMongoDB,
  connectRedis,
  closeConnections,
  getMongoDb: () => mongoDb,
  getRedisClient: () => redisClient,
  getCollection,
  // Redis key helpers
  keys: {
    getUserSessionKey,
    getRefreshTokenKey
  }
}; 