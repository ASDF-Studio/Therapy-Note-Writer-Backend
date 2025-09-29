# Therapy Note Writer API 🔧

> Secure backend API for the AI-powered therapy note generation platform - Powering mental health documentation with enterprise-grade security

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.8-green.svg)](https://www.mongodb.com/)
[![Commercial](https://img.shields.io/badge/License-Commercial-orange.svg)](LICENSE)
[![HIPAA](https://img.shields.io/badge/HIPAA-Compliant-blue.svg)](#security--compliance)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Security & Compliance](#security--compliance)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

## 🎯 About

**Therapy Note Writer API** is a secure, HIPAA-compliant backend service that powers the AI-driven therapy documentation platform. Built with Node.js and Express, this API provides robust authentication, AI integration, payment processing, and secure data management for mental health professionals.

Developed by **Airly Studio**, this backend ensures the highest standards of security, privacy, and compliance while delivering powerful AI-powered note generation capabilities.

## ✨ Features

### Core API Features
- **RESTful API**: Clean, well-documented REST endpoints
- **JWT Authentication**: Secure token-based authentication
- **AI Integration**: OpenAI GPT integration for intelligent note generation
- **Payment Processing**: Stripe subscription and payment management
- **Email Services**: SendGrid integration for notifications
- **SMS Services**: Twilio integration for appointment reminders
- **Session Management**: Secure session tracking and management
- **CORS Support**: Cross-origin resource sharing configuration

### Security Features
- **HIPAA Compliance**: Full compliance with healthcare data protection standards
- **Secure Headers**: Comprehensive security middleware
- **Input Validation**: Comprehensive request validation
- **Audit Logging**: Complete audit trails for all operations

### Integration Features
- **MongoDB Database**: Robust document-based data storage
- **OpenAI Integration**: Advanced AI-powered note generation
- **Stripe Webhooks**: Real-time payment event processing
- **SendGrid Email**: Professional email delivery service
- **Twilio SMS**: Reliable SMS notification service

## 🛠️ Tech Stack

### Core Framework
- **Runtime**: [Node.js](https://nodejs.org/) 18+
- **Framework**: [Express.js](https://expressjs.com/) 4.18.2
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) 6.8.2

### Authentication & Security
- **JWT**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) 9.0.0
- **Password Hashing**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) 2.4.3
- **CORS**: [cors](https://www.npmjs.com/package/cors) 2.8.5
- **Cookie Management**: [cookie-parser](https://www.npmjs.com/package/cookie-parser) 1.4.6

### External Services
- **AI Service**: [OpenAI](https://www.npmjs.com/package/openai) 3.2.1
- **Payment Processing**: [Stripe](https://www.npmjs.com/package/stripe) 11.18.0
- **Email Service**: [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) 8.1.0
- **SMS Service**: [Twilio](https://www.npmjs.com/package/twilio) 4.19.0

### Utilities & Middleware
- **HTTP Client**: [Axios](https://www.npmjs.com/package/axios) 1.6.2
- **Body Parsing**: [body-parser](https://www.npmjs.com/package/body-parser) 1.20.1
- **Environment Variables**: [dotenv](https://www.npmjs.com/package/dotenv) 16.3.1

### Development Tools
- **Development Server**: [Nodemon](https://www.npmjs.com/package/nodemon) 3.0.1

## 📋 Prerequisites

Before setting up the backend, ensure you have:

### Required Software
- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Latest version (comes with Node.js)
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: Latest version ([Download](https://git-scm.com/))

### Required Service Accounts
- **MongoDB Atlas**: For cloud database hosting
- **OpenAI Account**: For AI note generation API
- **Stripe Account**: For payment processing
- **SendGrid Account**: For email services
- **Twilio Account**: For SMS services

### Development Tools (Recommended)
- **Postman** or **Insomnia**: For API testing
- **MongoDB Compass**: For database management
- **VS Code**: With Node.js extensions

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Airly-Studio/therapy-note-writer-backend.git
   cd therapy-note-writer-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   See [Environment Configuration](#environment-configuration) for details.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Verify installation**
   The server should start on the configured port (default: 5000)
   ```
   Server running on port 5000
   MongoDB connected successfully
   ```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI generation | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | ✅ |
| `SENDGRID_API_KEY` | SendGrid API key for emails | ✅ |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS | ⚠️ |
| `CLIENT_URL` | Frontend application URL | ✅ |

## 🏃 Running the Application

### Development Mode

```bash
# Start with nodemon for auto-restart
npm start

# The server will restart automatically on file changes
```

### Production Mode

```bash
# Set production environment
export NODE_ENV=production

# Start server
node server.js
```

### Different Environments

```bash
# Development
npm run dev

# Production
npm run prod

# Testing
npm run test
```


## 🏗️ Project Structure

```
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # This file
│
│
├── controllers/             # Route controllers
│   ├── authController.js    # Authentication logic
│   ├── noteController.js    # Note generation logic
│   ├── paymentController.js # Payment processing
│   ├── userController.js    # User management
│   └── patientController.js # Patient management
│
├── middleware/              # Custom middleware
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling
│   ├── validation.js        # Input validation
│   ├── rateLimiter.js       # Rate limiting
│   └── security.js          # Security headers
│
├── models/                  # Mongoose models
│   ├── User.js              # User schema
│   ├── Note.js              # Note schema
│   ├── Patient.js           # Patient schema
│   ├── Session.js           # Session schema
│   └── Subscription.js      # Subscription schema
│
├── routes/                  # API routes
│   ├── auth.js              # Authentication routes
│   ├── notes.js             # Note management routes
│   ├── payments.js          # Payment routes
│   ├── users.js             # User routes
│   └── patients.js          # Patient routes
│
├── utils/                   # Utility functions
│   ├── helpers.js           # Common helpers
│   ├── validators.js        # Validation functions
│   ├── encryption.js        # Data encryption
│   └── logger.js            # Logging utility
│
├── uploads/                 # File uploads directory
├── logs/                    # Application logs
└── tests/                   # Test files (future)
    ├── auth.test.js
    ├── notes.test.js
    └── payments.test.js
```

## 🛠️ Available Scripts

```bash
npm start              # Start development server with nodemon
npm run build          # Install dependencies and build
node server.js         # Start production server
```

### Additional Useful Commands

```bash
# Database operations
npm run db:seed        # Seed database with sample data
npm run db:reset       # Reset database
npm run db:migrate     # Run migrations

# Development utilities
npm run logs           # View application logs
npm run test           # Run tests
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## 🔐 Security & Compliance

### HIPAA Compliance Features

- **Data Encryption**: All PHI encrypted at rest and in transit
- **Access Controls**: Role-based access control (RBAC)
- **Audit Logging**: Complete audit trails for all data access
- **Session Management**: Secure session handling with JWT
- **Data Minimization**: Only necessary data collection
- **Secure Transmission**: HTTPS enforced for all communications
- **Password Security**: bcrypt with high salt rounds
- **Input Sanitization**: Comprehensive input validation

### Security Best Practices

1. **Environment Variables**: All secrets stored in environment variables
2. **JWT Security**: Short-lived tokens with refresh mechanism
3. **Password Policy**: Strong password requirements
4. **API Rate Limiting**: Prevent abuse and DoS attacks
5. **Input Validation**: Comprehensive request validation
6. **Error Handling**: Secure error responses without information leakage
7. **Logging**: Security event logging and monitoring
8. **Database Security**: Parameterized queries to prevent injection

### Monitoring & Logging

- **Application Monitoring**: PM2 monitoring
- **Database Monitoring**: MongoDB Atlas monitoring
- **Error Tracking**: Sentry integration (recommended)
- **Performance Monitoring**: New Relic or DataDog
- **Log Aggregation**: ELK stack or similar
- **Uptime Monitoring**: UptimeRobot or Pingdom

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "auth"

# Run tests with coverage
npm run test:coverage
```

## 📊 API Performance

### Performance Targets
- **Response Time**: < 200ms for simple requests
- **Throughput**: 1000+ requests per minute
- **Availability**: 99.9% uptime
- **Error Rate**: < 0.1%

### Optimization Features
- **Database Indexing**: Optimized MongoDB indexes
- **Caching**: Redis caching for frequent queries
- **Connection Pooling**: MongoDB connection pooling
- **Compression**: Gzip response compression
- **CDN**: Static asset delivery via CDN

## 📄 License

This project is proprietary software owned by **Airly Studio**. All rights reserved.

**© 2025 Airly Studio.**

This software and its documentation are proprietary to Airly Studio and are protected by copyright law. Unauthorized copying, distribution, or modification is strictly prohibited.

## 👥 Team

**Developed by Airly Studio**

- **[Meraj Kazi](https://github.com/Meraj-Kazi)** - *Senior Full Stack Developer*

## 🙏 Acknowledgments

- Node.js and Express.js communities
- MongoDB and Mongoose teams
- OpenAI for AI capabilities
- Stripe for payment infrastructure
- SendGrid and Twilio for communication services
- Security and HIPAA compliance advisors

## 📞 Support & Contact

- **Company**: [Airly Studio](https://airlystudio.com)
- **Email**: hello@airlystudio.com

For technical support, API documentation, security concerns, or HIPAA compliance questions, contact our development team.

---

⚡ **Secure, Scalable, Engineered by Airly Studio**
