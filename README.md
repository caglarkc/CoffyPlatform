# CoffyPlatform - Modern Coffee Chain Software Ecosystem

<div align="center">
  
  <br/>
  <p><strong>A compact platform built with microservice architecture that digitizes the coffee experience</strong></p>
  <br/>
  
  ![GitHub last commit](https://img.shields.io/github/last-commit/caglarkc/CoffyPlatform)
  ![GitHub issues](https://img.shields.io/github/issues/caglarkc/CoffyPlatform)
  ![GitHub pull requests](https://img.shields.io/github/issues-pr/caglarkc/CoffyPlatform)
  ![License](https://img.shields.io/badge/license-MIT-blue)
</div>

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Installation Instructions](#-installation-instructions)
- [Development Environment](#-development-environment)
- [API Documentation](#-api-documentation)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [License](#-license)
- [Contact](#-contact)

## 🚀 About the Project

CoffyPlatform is a comprehensive software ecosystem that provides all the digital infrastructure needed for modern coffee chains. It manages all processes in an integrated way, from customers ordering through mobile applications to payment transactions, campaign management to reporting.

### Key Features

- **Strong User Management**: JWT-based authentication, social media login, email verification
- **Rich Order Experience**: QR code ordering, delivery tracking, order history viewing
- **Flexible Payment Solutions**: Credit card, mobile wallet, loyalty points payment
- **Campaign Engine**: User-specific campaigns, loyalty program, gift vouchers
- **Advanced Analytics**: Sales analysis, customer behavior, inventory tracking
- **Real-time Notifications**: Order status notifications, special offers, reminders

## 🏗 System Architecture

CoffyPlatform is designed with a microservices architecture where each service independently manages its own responsibility:

<div align="center">
  <img src="https://raw.githubusercontent.com/caglarkc/CoffyPlatform/main/docs/assets/architecture-diagram.png" alt="System Architecture" width="800" height="auto">
</div>

### Backend Architecture

- **API Gateway**: Central entry point for all requests
- **Service Registry**: Service registration and discovery mechanism
- **Config Server**: Central configuration management
- **Circuit Breaker**: Mechanism providing resilience against service failures
- **Microservices**: Independently developable, scalable services
  - Auth Service: Authentication and authorization
  - Menu Service: Product and menu management
  - Order Service: Order processing and tracking
  - Payment Service: Payment transactions
  - Campaign Service: Promotion and campaign management
  - Notification Service: Notification sending
  - Report Service: Analytics and reporting

### Frontend Architecture

- **Android Mobile Application**: Native mobile experience for customers
- **Management Panel (Web)**: Management interface for business owners (planned)

## 💻 Technology Stack

### Backend
- **Programming Language**: Node.js, TypeScript
- **API Framework**: Express.js
- **Authentication**: JWT, OAuth 2.0
- **Database**: MongoDB (for Microservices)
- **Messaging**: RabbitMQ (Inter-service communication)
- **Docker & Kubernetes**: Containerization and orchestration
- **CI/CD**: GitHub Actions
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

### Frontend
- **Android**: Java, MVVM architecture
- **Network Requests**: Retrofit, OkHttp
- **Local Database**: Room
- **Image Loading**: Glide
- **Dependency Injection**: Dagger Hilt
- **Asynchronous Operations**: Coroutines
- **UI Components**: Material Design Components
- **Testing**: JUnit, Espresso

## 🔧 Installation Instructions

### Prerequisites

- Node.js v16 or higher
- MongoDB v4.4 or higher
- Docker and Docker Compose
- Android Studio (for mobile app development)

### Backend Installation

To run all microservices with Docker:

```bash
# Navigate to the main directory
cd CoffyPlatform

# Start Docker containers
docker-compose up
```

Or to run manually in development environment:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start all services
npm run start:all

# To start a specific service
cd services/auth-service
npm install
npm start
```

### Frontend Installation

```bash
# Open Android Studio and import the project
cd frontend/Coffyapp

# Complete Gradle synchronization
# Select emulator or physical device
# Click Run button
```

For detailed installation instructions, see [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).

## 💡 Development Environment

### Recommended IDEs
- **Backend**: Visual Studio Code
- **Frontend**: Android Studio

### Useful Extensions
- ESLint and Prettier (Backend)
- Kotlin Plugin (Frontend)
- MongoDB Compass (Database Management)
- Postman (API Testing)

### Code Standards
This project follows:
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for Backend
- [Android Kotlin Style Guide](https://developer.android.com/kotlin/style-guide) for Frontend

## 📚 API Documentation

Each microservice provides its own API documentation through Swagger UI:

- Auth Service: `http://localhost:3001/api-docs`
- Menu Service: `http://localhost:3002/api-docs`
- Order Service: `http://localhost:3003/api-docs`
- Payment Service: `http://localhost:3004/api-docs`
- Campaign Service: `http://localhost:3005/api-docs`
- Notification Service: `http://localhost:3006/api-docs`
- Report Service: `http://localhost:3007/api-docs`

Additionally, you can use the API Gateway's Swagger UI to see all APIs together:
`http://localhost:3000/api-docs`

## 🔄 CI/CD Pipeline

This project automates continuous integration and deployment processes using GitHub Actions:

- **Lint Check**: Code standard check with ESLint
- **Unit Tests**: Automatic test execution with Jest
- **Integration Tests**: Testing service interoperability
- **Docker Image Creation**: Creating Docker images in CI process
- **Automatic Deployment**: Automatic deployment to test environment, manual approval for production deployment

## 📊 Project Structure

```
CoffyPlatform/
├── backend/                      # Backend main directory
│   ├── config/                   # Common configuration files
│   ├── gateway/                  # API Gateway
│   ├── services/                 # Microservices
│   │   ├── auth-service/         # Authentication service
│   │   ├── menu-service/         # Menu and product service
│   │   ├── order-service/        # Order processing service
│   │   ├── payment-service/      # Payment processing service
│   │   ├── campaign-service/     # Campaign management service
│   │   ├── notification-service/ # Notification service
│   │   └── report-service/       # Reporting service
│   ├── shared/                   # Shared code and utilities between services
│   ├── docker-compose.yml        # Docker configuration file
│   └── README.md                 # Backend documentation
│
├── frontend/                     # Frontend main directory
│   └── Coffyapp/                 # Android application
│       ├── app/                  # Application code
│       ├── gradle/               # Gradle configuration
│       └── README.md             # Frontend documentation
│
├── docs/                         # Technical documentation and assets
│   ├── assets/                   # Images, diagrams
│   ├── api/                      # API documents
│   └── architecture/             # Architecture documents
│
├── .github/                      # GitHub Actions workflow definitions
├── .gitignore                    # Files to be ignored by Git
├── LICENSE                       # License information
└── README.md                     # This file
```

For detailed project structure, see [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).

## 👥 Contributing

To contribute to this project, please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed contribution rules, see the `CONTRIBUTING.md` file.

## ❓ FAQ

<details>
<summary><b>What architecture does the project have?</b></summary>
<p>
CoffyPlatform is built on a microservices architecture. Each service performs a specific business function and can be developed, tested, and deployed independently.
</p>
</details>

<details>
<summary><b>How do backend services communicate?</b></summary>
<p>
Inter-service communication is carried out through REST API and RabbitMQ messaging system. REST API is used for synchronous communication, while RabbitMQ is used for asynchronous operations.
</p>
</details>

<details>
<summary><b>Which platforms does the mobile application support?</b></summary>
<p>
Currently, there is a native application for the Android platform. iOS support is planned for future versions.
</p>
</details>

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

Çağlar Koçer - [alicaglarkocer@gmail.com](mailto:alicaglarkocer@gmail.com)

Project Link: [https://github.com/caglarkc/CoffyPlatform](https://github.com/caglarkc/CoffyPlatform)

---
⭐️ **CoffyPlatform** - Contributes to business growth by providing modern digital experiences to coffee lovers.
