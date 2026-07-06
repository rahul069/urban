#!/bin/bash

# Urban Home Services Marketplace - API Integration Test Script
# This script tests the API integration across all frontend applications

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3000/api"
TEST_USER_EMAIL="testcustomer@example.com"
TEST_USER_PASSWORD="password123"
TEST_PROVIDER_EMAIL="testprovider@example.com"
TEST_PROVIDER_PASSWORD="password123"
TEST_ADMIN_EMAIL="admin@example.com"
TEST_ADMIN_PASSWORD="admin123"

# Function to check if backend is running
check_backend() {
    echo -e "${YELLOW}Checking backend connection...${NC}"
    
    if curl -s "$BACKEND_URL/health" > /dev/null; then
        echo -e "${GREEN}✓ Backend is running${NC}"
        return 0
    else
        echo -e "${RED}✗ Backend is not running or not accessible at $BACKEND_URL${NC}"
        echo -e "${YELLOW}Please start the backend server and try again${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -e "${YELLOW}Testing $description ($endpoint)...${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BACKEND_URL$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$BACKEND_URL$endpoint")
    fi
    
    if [[ "$response" =~ ^2[0-9]{2}$ ]]; then
        echo -e "${GREEN}✓ $description - Status: $response${NC}"
        return 0
    else
        echo -e "${RED}✗ $description - Status: $response${NC}"
        return 1
    fi
}

# Function to test authentication flow
test_authentication() {
    echo -e "\n${YELLOW}=== Testing Authentication Flow ===${NC}"
    
    # Test customer registration
    test_endpoint "/auth/register" "Customer Registration" "POST" "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\",\"firstName\":\"Test\",\"lastName\":\"Customer\",\"phone\":\"+49123456789\",\"userType\":\"customer\"}"
    
    # Test customer login
    test_endpoint "/auth/login" "Customer Login" "POST" "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\"}"
    
    # Test provider registration
    test_endpoint "/auth/register" "Provider Registration" "POST" "{\"email\":\"$TEST_PROVIDER_EMAIL\",\"password\":\"$TEST_PROVIDER_PASSWORD\",\"firstName\":\"Test\",\"lastName\":\"Provider\",\"phone\":\"+49987654321\",\"userType\":\"provider\"}"
    
    # Test provider login
    test_endpoint "/auth/login" "Provider Login" "POST" "{\"email\":\"$TEST_PROVIDER_EMAIL\",\"password\":\"$TEST_PROVIDER_PASSWORD\"}"
    
    # Test admin login (if admin credentials are available)
    if [ -n "$TEST_ADMIN_EMAIL" ] && [ -n "$TEST_ADMIN_PASSWORD" ]; then
        test_endpoint "/auth/login" "Admin Login" "POST" "{\"email\":\"$TEST_ADMIN_EMAIL\",\"password\":\"$TEST_ADMIN_PASSWORD\"}"
    fi
}

# Function to test provider endpoints
test_provider_endpoints() {
    echo -e "\n${YELLOW}=== Testing Provider Endpoints ===${NC}"
    
    # Get providers
    test_endpoint "/providers" "Get Providers"
    
    # Get providers with location filter
    test_endpoint "/providers?latitude=52.5200&longitude=13.4050&radius=50" "Get Providers by Location"
}

# Function to test booking endpoints
test_booking_endpoints() {
    echo -e "\n${YELLOW}=== Testing Booking Endpoints ===${NC}"
    
    # Create booking (would need auth token in a real test)
    # test_endpoint "/bookings" "Create Booking" "POST" "{\"customerId\":\"test-customer-id\",\"providerId\":\"test-provider-id\",\"serviceType\":\"plumbing\",\"description\":\"Test booking\",\"scheduledAt\":\"2026-07-10T14:00:00Z\",\"customerAddress\":\"123 Test St\"}"
    
    # Get bookings
    test_endpoint "/bookings" "Get Bookings"
}

# Function to test payment endpoints
test_payment_endpoints() {
    echo -e "\n${YELLOW}=== Testing Payment Endpoints ===${NC}"
    
    # Get payments
    test_endpoint "/payments" "Get Payments"
}

# Function to test invoice endpoints
test_invoice_endpoints() {
    echo -e "\n${YELLOW}=== Testing Invoice Endpoints ===${NC}"
    
    # Get invoices
    test_endpoint "/invoices" "Get Invoices"
}

# Function to test verification endpoints
test_verification_endpoints() {
    echo -e "\n${YELLOW}=== Testing Verification Endpoints ===${NC}"
    
    # Get verification status
    test_endpoint "/providers/test-provider-id/verification" "Get Verification Status"
}

# Main test function
run_tests() {
    echo -e "${YELLOW}Starting API Integration Tests...${NC}"
    
    if ! check_backend; then
        exit 1
    fi
    
    # Test basic endpoints
    test_endpoint "/health" "Health Check"
    test_endpoint "/" "API Root"
    
    # Test authentication
    test_authentication
    
    # Test provider endpoints
    test_provider_endpoints
    
    # Test booking endpoints
    test_booking_endpoints
    
    # Test payment endpoints
    test_payment_endpoints
    
    # Test invoice endpoints
    test_invoice_endpoints
    
    # Test verification endpoints
    test_verification_endpoints
    
    echo -e "\n${YELLOW}API Integration Tests Complete${NC}"
}

# Run the tests
run_tests