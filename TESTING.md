# Urban Home Services Marketplace - Frontend API Integration Testing

## Overview
This document outlines the testing approach for verifying the API integration across all frontend applications (Customer App, Provider App, Admin Dashboard).

## Prerequisites
1. Backend server running at `http://localhost:3000`
2. All frontend applications built and running
3. Test data available in the database
4. API client library built and installed

## Test Environment Setup
```bash
# Start backend
cd /home/rahul/Documents/urban/backend
docker-compose up

# Build API client library
cd /home/rahul/Documents/urban/libs/api-client
npm install
npm run build

# Install dependencies for each frontend application
cd /home/rahul/Documents/urban/apps/customer/CustomerApp
npm install

cd /home/rahul/Documents/urban/apps/ProviderAppNew
npm install

cd /home/rahul/Documents/urban/apps/admin
npm install
```

## Test Cases

### 1. Customer App Testing

#### 1.1 Authentication
- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] Token persistence

#### 1.2 Provider Search
- [ ] Search providers by service type
- [ ] Filter providers by location
- [ ] View provider details
- [ ] Verify provider verification status is displayed

#### 1.3 Booking Flow
- [ ] Create booking request
- [ ] View booking details
- [ ] View booking status
- [ ] Verify booking appears in profile

#### 1.4 Payments & Invoices
- [ ] View invoices in profile
- [ ] Verify invoice details
- [ ] Test invoice generation (PDF/XML)

#### 1.5 Profile Management
- [ ] View user bookings
- [ ] View user invoices
- [ ] Verify data persistence

### 2. Provider App Testing

#### 2.1 Authentication
- [ ] Provider registration
- [ ] Provider login
- [ ] Provider logout

#### 2.2 Onboarding Flow
- [ ] Complete provider profile
- [ ] Upload Meisterbrief
- [ ] Upload ID document
- [ ] Upload insurance document
- [ ] Upload bank statement
- [ ] Verify document upload success

#### 2.3 Job Management
- [ ] View pending job requests
- [ ] Accept job request
- [ ] View accepted jobs
- [ ] View completed jobs
- [ ] Verify job status updates

#### 2.4 Invoices
- [ ] View provider invoices
- [ ] Verify invoice details
- [ ] Test PDF generation

#### 2.5 Profile Management
- [ ] View verification status
- [ ] View provider information
- [ ] Verify data persistence

### 3. Admin Dashboard Testing

#### 3.1 Authentication
- [ ] Admin login
- [ ] Admin logout

#### 3.2 Provider Verification
- [ ] View pending verification requests
- [ ] Approve provider verification
- [ ] Reject provider verification
- [ ] View verification history

#### 3.3 Booking Management
- [ ] View all bookings
- [ ] Filter bookings by status
- [ ] View booking details

#### 3.4 Dispute Resolution
- [ ] View disputes
- [ ] Resolve dispute
- [ ] Track dispute history

#### 3.5 Analytics
- [ ] View dashboard metrics
- [ ] Verify data accuracy

## Test Script

### Customer App Test Script
```bash
# Start Customer App
cd /home/rahul/Documents/urban/apps/customer/CustomerApp
npx react-native run-android # or run-ios
```

1. **Register a new user**
   - Navigate to registration screen
   - Enter valid credentials
   - Verify successful registration and login

2. **Search for providers**
   - Enter a service type (e.g., "plumbing")
   - Verify providers are displayed
   - Verify provider details (name, trade, verification status)

3. **Create a booking**
   - Select a provider
   - Fill in booking details
   - Submit booking request
   - Verify booking appears in profile

4. **View invoices**
   - Navigate to profile
   - Verify invoices are displayed
   - Verify invoice details

### Provider App Test Script
```bash
# Start Provider App
cd /home/rahul/Documents/urban/apps/ProviderAppNew
npx react-native run-android # or run-ios
```

1. **Register as provider**
   - Navigate to registration screen
   - Enter provider details
   - Verify successful registration

2. **Complete onboarding**
   - Fill in business information
   - Upload required documents
   - Verify document upload success

3. **Manage job requests**
   - View pending job requests
   - Accept a job request
   - Verify job status updates

4. **View invoices**
   - Navigate to profile
   - Verify invoices are displayed
   - Test PDF generation

### Admin Dashboard Test Script
```bash
# Start Admin Dashboard
cd /home/rahul/Documents/urban/apps/admin
npm run dev
```

1. **Login as admin**
   - Navigate to login page
   - Enter admin credentials
   - Verify successful login

2. **Manage provider verification**
   - View pending verification requests
   - Approve a provider
   - Reject a provider
   - Verify status updates

3. **Monitor bookings**
   - View all bookings
   - Filter by status
   - View booking details

4. **View analytics**
   - Verify dashboard metrics
   - Verify data accuracy

## Expected Results

### Customer App
- ✅ Users can register, login, and logout
- ✅ Users can search for providers by service type and location
- ✅ Users can create booking requests
- ✅ Users can view their bookings and invoices
- ✅ All API calls return expected data

### Provider App
- ✅ Providers can register and complete onboarding
- ✅ Providers can upload required documents
- ✅ Providers can manage job requests
- ✅ Providers can view their invoices
- ✅ All API calls return expected data

### Admin Dashboard
- ✅ Admins can login and logout
- ✅ Admins can manage provider verification
- ✅ Admins can monitor bookings
- ✅ Admins can view analytics
- ✅ All API calls return expected data

## Troubleshooting

### Common Issues
1. **Network errors**
   - Verify backend is running
   - Check API base URL in environment variables
   - Verify CORS settings on backend

2. **Authentication failures**
   - Verify user credentials
   - Check token storage and persistence
   - Verify login endpoint response

3. **Data not displaying**
   - Check API response structure
   - Verify data mapping in frontend
   - Check for errors in console

4. **Document upload failures**
   - Verify file size limits
   - Check file type restrictions
   - Verify backend storage configuration

### Debugging Tips
```bash
# Check backend logs
docker-compose logs -f

# Check frontend logs
# For React Native: shake device and select "Debug JS Remotely"
# For Admin Dashboard: check browser console

# Test API endpoints directly
curl http://localhost:3000/api/providers
curl http://localhost:3000/api/bookings
```

## Test Data

### Sample Users
```json
// Customer
{
  "email": "customer@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+49123456789"
}

// Provider
{
  "email": "provider@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+49987654321",
  "businessName": "Jane's Plumbing",
  "trade": "Plumber"
}

// Admin
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Sample Booking
```json
{
  "serviceType": "plumbing",
  "description": "Leaky faucet repair",
  "scheduledAt": "2026-07-10T14:00:00Z",
  "customerAddress": "123 Main St, Berlin"
}
```