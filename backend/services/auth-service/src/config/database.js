/**
 * Auth Service Database Configuration
 * Contains connection settings for Redis and MongoDB
 */

module.exports = {
  // MongoDB connection settings
  mongodb: {
    url: 'mongodb://localhost:27017',
    dbName: 'authServiceDB',
    options: {
      serverSelectionTimeoutMS: 5000, // 5 saniye sonra timeout
      socketTimeoutMS: 45000, // 45 saniye sonra socket timeout
    }
  },
  
  // Redis connection settings
  redis: {
    host: 'redis-16818.c8.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 16818,
    password: 'MhiuqV5oCNbUNmxhmFrbrMVfRv5w6RtL',
    username: 'default',
    db: 0
  }
}; 