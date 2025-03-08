// Load environment variables first
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/auth.routes');
const { requestContextMiddleware } = require('./middlewares/requestContext');
const errorHandler = require('./middlewares/errorHandler/errorHandler');

const { 
  connectMongoDB, 
  connectRedis, 
  closeConnections 
} = require('./utils/database');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001; // Auth service port

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestContextMiddleware);

// Routes
app.use('/api/auth', authRoutes);

// Error middleware - tüm route'lardan sonra eklenmelidir
app.use(errorHandler);

// Initialize database connections
async function initializeDatabases() {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Connect to Redis
    await connectRedis();
    
    console.log('[Auth Service] All database connections established successfully');
  } catch (error) {
    console.error('[Auth Service] Failed to initialize databases:', error);
    process.exit(1);
  }
}

// Import routes (to be implemented)
// const authRoutes = require('./routes/auth');

// Start the server
async function startServer() {
  try {
    // Initialize database connections first
    await initializeDatabases();
    
    // Apply routes
    // app.use('/api/auth', authRoutes);
    
    // Basic route for testing
    app.get('/', (req, res) => {
      res.json({ 
        service: 'Auth Service',
        status: 'running',
        message: 'Auth Service is running with MongoDB and Redis connections' 
      });
    });
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`[Auth Service] Server running on port ${PORT}`);
    });
    
    // Handle application shutdown
    process.on('SIGINT', async () => {
      console.log('[Auth Service] Application shutting down...');
      await closeConnections();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('[Auth Service] Application shutting down...');
      await closeConnections();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('[Auth Service] Failed to start server:', error);
    await closeConnections();
    process.exit(1);
  }
}

// Start the application
startServer();
