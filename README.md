# Urban Home Services Marketplace

Urban is a comprehensive home services marketplace connecting customers with verified service providers in Germany. The platform handles booking, payments, verification, and invoicing for services like plumbing, electrical work, cleaning, and more.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Getting Started](#getting-started)
6. [Development](#development)
7. [Deployment](#deployment)
8. [Configuration](#configuration)
9. [Testing](#testing)
10. [Monitoring](#monitoring)
11. [Contributing](#contributing)
12. [License](#license)

## Project Overview

Urban provides a complete ecosystem for home services:
- **Customer App**: Book services, make payments, receive invoices
- **Provider App**: Manage bookings, verify credentials, receive payments
- **Admin Dashboard**: Manage providers, monitor system health
- **Backend Services**: Handle business logic, payments, notifications

## Architecture

```mermaid
architectureDiagram
  direction LR
  subgraph Frontend
    A[Customer App] --> B[Backend API]
    C[Provider App] --> B
    D[Admin Dashboard] --> B
  end
  
  subgraph Backend
    B --> E[PostgreSQL]
    B --> F[Redis]
    B --> G[S3/Hetzner Storage]
    B --> H[Stripe]
    B --> I[Sentry]
    B --> J[Prometheus]
  end
```

## Features

### Core Features
- ✅ **Provider Verification**: HWK number validation, document upload, insurance tracking
- ✅ **Booking System**: Service booking, scheduling, status tracking
- ✅ **Payment Processing**: Stripe integration, multiple payment methods
- ✅ **Invoice Generation**: PDF + ZUGFeRD/XRechnung for German compliance
- ✅ **GDPR Compliance**: Document retention policies, data anonymization
- ✅ **Monitoring**: Sentry for errors, Prometheus for metrics
- ✅ **Notifications**: Email and SMS notifications

### Technical Features
- ✅ **Geospatial Search**: Find providers by location
- ✅ **Automatic Invoicing**: Generate invoices when payments complete
- ✅ **Document Storage**: Secure file storage with S3/Hetzner
- ✅ **Cron Jobs**: Automated document cleanup, reverification reminders
- ✅ **Health Checks**: Application and database health monitoring
- ✅ **Docker Support**: Containerized deployment

## Technology Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis
- **ORM**: TypeORM
- **Payments**: Stripe
- **File Storage**: S3/Hetzner Object Storage
- **Monitoring**: Sentry, Prometheus, Grafana
- **Scheduling**: @nestjs/schedule
- **Validation**: class-validator
- **Testing**: Jest

### Frontend
- **Customer App**: React Native
- **Provider App**: React Native
- **Admin Dashboard**: React + Vite
- **Marketing Site**: Next.js

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (Kubernetes ready)
- **CI/CD**: GitHub Actions
- **Hosting**: Hetzner/AWS

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Docker 24+
- Docker Compose 2.20+
- PostgreSQL 15+ with PostGIS
- Redis 7+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/urban.git
cd urban

# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start services
docker-compose up -d
```

## Development

### Running the Backend
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Running Tests
```bash
# Unit tests
npm test

# Test with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- src/migrations/YourMigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Deployment

See the [DEPLOYMENT.md](DEPLOYMENT.md) file for detailed deployment instructions.

## Configuration

See the `.env.example` file for all required environment variables.

## Testing

The project includes comprehensive tests:
- Unit tests for services and controllers
- Integration tests for payment flow
- End-to-end tests for API endpoints
- Mock tests for external services

## Monitoring

### Sentry
- Error tracking
- Performance monitoring
- Release tracking

### Prometheus & Grafana
- HTTP request metrics
- Database performance
- System resources
- Custom dashboards

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.