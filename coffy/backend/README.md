# CoffyPlatform Backend

## Overview
CoffyPlatform's backend is built with a microservices architecture, providing a robust and scalable foundation for the coffee chain management system.

## Project Structure
```
backend/
├── config/                   # Common configuration files
├── gateway/                  # API Gateway
├── services/                 # Microservices
│   ├── auth-service/         # Authentication service
│   ├── store-service/        # Store management service
│   └── [other-services]/     # Other microservices
├── shared/                   # Shared code and utilities
├── docker-compose.yml        # Docker configuration
└── README.md                 # This file
```

## Prerequisites
- Node.js v16 or higher
- MongoDB v4.4 or higher
- Redis
- Docker and Docker Compose

## Installation

### Using Docker
```bash
# Navigate to the backend directory
cd backend

# Start all services with Docker Compose
docker-compose up
```

### Manual Installation
```bash
# Install dependencies
npm install

# Start all services
npm run start:all

# Start individual service
cd services/auth-service
npm install
npm start
```

## Development

### Running Services Individually
Each service can be run independently for development:
```bash
# Auth Service
cd services/auth-service
npm run dev

# Store Service
cd services/store-service
npm run dev
```

### Environment Variables
Each service requires its own `.env` file. Example structure:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auth-db
REDIS_URL=redis://localhost:6379
```

## Testing
```bash
# Run all tests
npm test

# Run specific service tests
cd services/auth-service
npm test
```

## API Documentation
Each service provides its own Swagger documentation:
- Auth Service: `http://localhost:3001/api-docs`
- Store Service: `http://localhost:3002/api-docs`

## Contributing
Please read the main project's CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 