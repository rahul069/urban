# Urban Home Services Marketplace - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Monitoring Setup](#monitoring-setup)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Scaling](#scaling)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Docker**: v24.x or higher
- **Docker Compose**: v2.20.x or higher
- **PostgreSQL**: v15.x with PostGIS extension
- **Redis**: v7.x

### Required Accounts
- **Stripe**: For payment processing
- **Sentry**: For error monitoring
- **Hetzner Object Storage** or **AWS S3**: For file storage
- **Google Maps API**: For location services (optional)

## Environment Setup

### 1. Clone the Repository
```bash
cd /opt
mkdir urban
cd urban
git clone https://github.com/your-repo/urban.git .
```

### 2. Install Dependencies
```bash
cd backend
npm install --production
```

## Backend Deployment

### 1. Docker Setup
The application is containerized using Docker. The `docker-compose.yml` file includes:
- Backend service
- PostgreSQL with PostGIS
- Redis

### 2. Build and Start Containers
```bash
docker-compose build
docker-compose up -d
```

### 3. Production Dockerfile
The production Dockerfile includes optimizations:
- Multi-stage build
- Proper user permissions
- Production-ready Node.js configuration
- Health checks

## Database Setup

### 1. PostgreSQL with PostGIS
The application requires PostgreSQL with the PostGIS extension for geospatial queries.

### 2. Database Initialization
```bash
# Create database
docker exec -it urban-postgres psql -U postgres -c "CREATE DATABASE urban;"

# Enable PostGIS extension
docker exec -it urban-postgres psql -U postgres -d urban -c "CREATE EXTENSION postgis;"

# Run migrations
npm run migration:run
```

## Configuration

### 1. Environment Variables
Create a `.env.production` file in the backend directory:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_DATABASE=urban

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# S3/Hetzner Object Storage
S3_ENDPOINT=https://your-endpoint.com
S3_REGION=eu-central-1
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=urban-documents

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456

# Document Retention
DOCUMENT_RETENTION_DAYS=3650

# Security
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=30d
```

### 2. Security Best Practices
- Use strong passwords for all services
- Enable SSL/TLS for all external communications
- Rotate secrets regularly
- Use environment variables for sensitive data
- Enable database encryption

## Running the Application

### 1. Start Services
```bash
docker-compose -f docker-compose.production.yml up -d
```

### 2. Health Checks
```bash
# Check application health
curl http://localhost:3000/health

# Check database connection
docker exec -it urban-backend npm run db:check
```

### 3. Logging
```bash
# View logs
docker-compose logs -f

# Set up log rotation
# Configure in your logging service (e.g., AWS CloudWatch, ELK stack)
```

## Monitoring Setup

### 1. Sentry Configuration
- Create a Sentry project for the application
- Configure alerts for critical errors
- Set up performance monitoring
- Configure release tracking

### 2. Prometheus & Grafana
- **Prometheus**: Scrapes metrics from `/metrics` endpoint
- **Grafana**: Visualizes metrics with dashboards

### 3. Recommended Dashboards
- HTTP Requests (count, duration, error rates)
- Database Performance
- Active Users
- System Resources (CPU, Memory)
- Payment Processing
- Document Uploads

## CI/CD Pipeline

### 1. GitHub Actions Example
```yaml
name: Urban Backend CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Login to Docker Registry
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
      - name: Build and Push
        run: |
          docker-compose -f docker-compose.production.yml build
          docker push your-registry/urban-backend:latest
      - name: Deploy to Server
        run: |
          ssh user@your-server "cd /opt/urban && docker-compose pull && docker-compose up -d"
```

## Scaling

### 1. Horizontal Scaling
- Use Kubernetes or Docker Swarm for container orchestration
- Configure auto-scaling based on CPU/memory usage
- Use Redis for session management

### 2. Database Scaling
- Configure read replicas for PostgreSQL
- Use connection pooling (PgBouncer)
- Consider sharding for large datasets

### 3. Caching
- Enable Redis caching for frequent queries
- Cache static assets
- Implement CDN for file storage

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check database logs
docker-compose logs postgres

# Test database connection
docker exec -it urban-backend npm run db:check
```

#### 2. Stripe Webhook Failures
- Verify webhook secret matches
- Check endpoint is publicly accessible
- Verify SSL certificate is valid

#### 3. File Upload Failures
```bash
# Test S3 connection
docker exec -it urban-backend npm run storage:test
```

#### 4. Performance Issues
- Check Prometheus metrics
- Review slow queries
- Optimize database indexes

### Support
For additional support, contact the Urban development team at support@urban-services.com.

## Production Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] Monitoring and alerting set up
- [ ] SSL certificates installed
- [ ] Stripe webhooks configured
- [ ] S3/Hetzner storage tested
- [ ] All tests passing
- [ ] CI/CD pipeline working
- [ ] Rollback plan in place
- [ ] Documentation updated