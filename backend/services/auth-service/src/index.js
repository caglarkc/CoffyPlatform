// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const { requestContextMiddleware } = require('./middlewares/requestContext');
const errorHandler = require('./middlewares/errorHandler/errorHandler');
const keyRotationService = require('./services/security/keyRotation.service');
const { authAdminMiddleware } = require('./middlewares/authMiddleware');

const { 
  connectMongoDB, 
  connectRedis, 
  closeConnections 
} = require('./utils/database');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001; // Auth service port

// CORS middleware - Frontend'in 3000 portundan isteklere izin ver
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestContextMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

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

// Initialize key rotation
function initializeKeyRotation() {
  try {
    // Schedule key rotation every 12 hours
    const keyRotationJob = keyRotationService.scheduleKeyRotation('0 */12 * * *');
    
    console.log('[Auth Service] Key rotation service initialized successfully');
    
    // Generate initial key if it doesn't exist
    if (!process.env.SECRET_KEY) {
      console.log('[Auth Service] No SECRET_KEY found, generating initial key...');
      keyRotationService.updateSecretKey()
        .then(() => console.log('[Auth Service] Initial SECRET_KEY generated successfully'))
        .catch(err => console.error('[Auth Service] Failed to generate initial SECRET_KEY:', err));
    }
    
    return keyRotationJob;
  } catch (error) {
    console.error('[Auth Service] Failed to initialize key rotation service:', error);
    return null;
  }
}

// Start the server
async function startServer() {
  try {
    // Initialize database connections first
    await initializeDatabases();
    
    // Initialize key rotation service
    const keyRotationJob = initializeKeyRotation();
    
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
      if (keyRotationJob) {
        keyRotationJob.stop();
        console.log('[Auth Service] Key rotation service stopped');
      }
      await closeConnections();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('[Auth Service] Application shutting down...');
      if (keyRotationJob) {
        keyRotationJob.stop();
        console.log('[Auth Service] Key rotation service stopped');
      }
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
