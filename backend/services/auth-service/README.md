# Auth Service

Authentication and Authorization microservice for the Coffy Project.

## Features

- User registration and login
- JWT-based authentication
- Refresh token mechanism
- Password change and account management
- Role-based authorization
- Event publishing via RabbitMQ
- Redis for token storage
- MongoDB for user data storage

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Redis
- RabbitMQ
- JWT for authentication
- Winston for logging

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- RabbitMQ

### Installation

1. Clone the repository
2. Navigate to the auth-service directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example`
5. Start the service:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Management

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/profile` - Update user profile
- `POST /api/users/change-password` - Change user password
- `POST /api/users/deactivate` - Deactivate user account

## Environment Variables

See `.env.example` for all required environment variables.

## Docker

The service can be run in a Docker container. A Dockerfile is provided.

```bash
# Build the Docker image
docker build -t auth-service .

# Run the container
docker run -p 3001:3001 --env-file .env auth-service
```

## License

MIT
