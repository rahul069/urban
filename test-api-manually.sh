#!/bin/bash

# Urban Home Services Marketplace - Manual API Testing Script
# This script tests the API endpoints manually

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

# Function to test API endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-}
    local token=${5:-}
    
    echo -e "${YELLOW}Testing $description ($endpoint)...${NC}"
    
    if [ -z "$data" ]; then
        if [ -z "$token" ]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BACKEND_URL$endpoint")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" -X $method -H "Authorization: Bearer $token" "$BACKEND_URL$endpoint")
        fi
    else
        if [ -z "$token" ]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$BACKEND_URL$endpoint")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" -X $method -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" "$BACKEND_URL$endpoint")
        fi
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
    login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\"}" "$BACKEND_URL/auth/login")
    customer_token=$(echo $login_response | jq -r '.accessToken')
    
    if [ "$customer_token" != "null" ] && [ -n "$customer_token" ]; then
        echo -e "${GREEN}✓ Customer Login - Token received${NC}"
    else
        echo -e "${RED}✗ Customer Login - Failed to get token${NC}"
    fi
    
    # Test provider registration
    test_endpoint "/auth/register" "Provider Registration" "POST" "{\"email\":\"$TEST_PROVIDER_EMAIL\",\"password\":\"$TEST_PROVIDER_PASSWORD\",\"firstName\":\"Test\",\"lastName\":\"Provider\",\"phone\":\"+49987654321\",\"userType\":\"provider\"}"
    
    # Test provider login
    login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"$TEST_PROVIDER_EMAIL\",\"password\":\"$TEST_PROVIDER_PASSWORD\"}" "$BACKEND_URL/auth/login")
    provider_token=$(echo $login_response | jq -r '.accessToken')
    
    if [ "$provider_token" != "null" ] && [ -n "$provider_token" ]; then
        echo -e "${GREEN}✓ Provider Login - Token received${NC}"
    else
        echo -e "${RED}✗ Provider Login - Failed to get token${NC}"
    fi
    
    # Return tokens for further testing
    echo "customer_token=$customer_token" > api_tokens.env
    echo "provider_token=$provider_token" >> api_tokens.env
}

# Function to test provider endpoints
test_provider_endpoints() {
    echo -e "\n${YELLOW}=== Testing Provider Endpoints ===${NC}"
    
    # Source tokens
    source api_tokens.env
    
    # Get providers
    test_endpoint "/providers" "Get Providers" "GET"
    
    # Get providers with location filter
    test_endpoint "/providers?latitude=52.5200&longitude=13.4050&radius=50" "Get Providers by Location" "GET"
    
    # Test with customer token
    if [ -n "$customer_token" ]; then
        test_endpoint "/providers" "Get Providers (Authenticated)" "GET" "" "$customer_token"
    fi
}

# Function to test booking endpoints
test_booking_endpoints() {
    echo -e "\n${YELLOW}=== Testing Booking Endpoints ===${NC}"
    
    # Source tokens
    source api_tokens.env
    
    # Create booking (would need auth token)
    if [ -n "$customer_token" ]; then
        test_endpoint "/bookings" "Create Booking" "POST" "{\"providerId\":\"test-provider-id\",\"serviceType\":\"plumbing\",\"description\":\"Test booking\",\"scheduledAt\":\"2026-07-10T14:00:00Z\",\"customerAddress\":\"123 Test St\"}" "$customer_token"
    fi
    
    # Get bookings
    test_endpoint "/bookings" "Get Bookings" "GET"
}

# Main test function
run_tests() {
    echo -e "${YELLOW}Starting Manual API Tests...${NC}"
    
    # Test basic endpoints
    test_endpoint "/health" "Health Check" "GET"
    test_endpoint "/" "API Root" "GET"
    
    # Test authentication
    test_authentication
    
    # Test provider endpoints
    test_provider_endpoints
    
    # Test booking endpoints
    test_booking_endpoints
    
    echo -e "\n${YELLOW}Manual API Tests Complete${NC}"
    echo -e "${YELLOW}Tokens saved to api_tokens.env for further testing${NC}"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed. Please install jq for JSON parsing.${NC}"
    echo -e "${YELLOW}On Ubuntu/Debian: sudo apt-get install jq${NC}"
    echo -e "${YELLOW}On Mac: brew install jq${NC}"
    exit 1
fi

# Run the tests
run_tests