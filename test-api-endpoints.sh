#!/bin/bash

# Test API endpoints with a running backend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test API endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -e "${YELLOW}Testing $description ($endpoint)...${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "http://localhost:3000/api$endpoint")
        status=$?
    else
        response=$(curl -s -X $method -H "Content-Type: application/json" -d "$data" "http://localhost:3000/api$endpoint")
        status=$?
    fi
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓ $description${NC}"
        echo "Response: $response"
        return 0
    else
        echo -e "${RED}✗ $description${NC}"
        return 1
    fi
}

# Start the backend in the background and keep it running
start_backend() {
    echo -e "${YELLOW}Starting minimal backend...${NC}"
    cd /home/rahul/Documents/urban/minimal-backend
    nohup npm run start:dev > backend.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    sleep 3 # Give it time to start
}

# Stop the backend
stop_backend() {
    echo -e "${YELLOW}Stopping backend...${NC}"
    kill $BACKEND_PID
    sleep 1
}

# Test all endpoints
test_all_endpoints() {
    start_backend
    
    # Test health check
    test_endpoint "/health" "Health Check"
    
    # Test API root
    test_endpoint "/" "API Root"
    
    # Test provider endpoints
    test_endpoint "/providers" "Get Providers"
    test_endpoint "/providers/1" "Get Provider by ID"
    test_endpoint "/providers?latitude=52.5200&longitude=13.4050&radius=50" "Get Providers by Location"
    
    # Test auth endpoints
    test_endpoint "/auth/register" "Register User" "POST" '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","phone":"+49123456789","userType":"customer"}'
    test_endpoint "/auth/login" "Login User" "POST" '{"email":"test@example.com","password":"password123"}'
    
    # Test booking endpoints
    test_endpoint "/bookings" "Get Bookings" "POST" '{"providerId":"1","serviceType":"plumbing","description":"Test booking","scheduledAt":"2026-07-10T14:00:00Z","customerAddress":"123 Test St"}'
    
    stop_backend
}

# Run the tests
test_all_endpoints