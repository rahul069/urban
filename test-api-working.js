// Urban Home Services - Working API Test Suite

const axios = require('axios');
const fs = require('fs');

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const testResults = [];

// Test Users
const testUsers = {
  customer: {
    email: 'customer@urbanhome.services',
    password: 'customer123',
    firstName: 'John',
    lastName: 'Customer',
    userType: 'customer'
  },
  provider: {
    email: 'provider@urbanhome.services',
    password: 'provider123',
    firstName: 'Jane',
    lastName: 'Provider',
    userType: 'provider'
  }
};

// Test Suite
async function runTests() {
  console.log('🚀 Urban Home Services - Working API Test Suite');
  console.log('='.repeat(50));
  
  try {
    // Test health check
    await testHealthCheck();
    
    // Test authentication
    await testAuthentication();
    
    // Test provider endpoints
    await testProviderEndpoints();
    
    // Test booking endpoints
    await testBookingEndpoints();
    
    // Generate summary
    generateSummary();
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    generateSummary();
  }
}

// Test Helpers
function logTest(name, result, error = null) {
  const testResult = {
    name,
    result: result ? '✅ PASS' : '❌ FAIL',
    error: error ? error.message : null
  };
  
  testResults.push(testResult);
  console.log(`[${testResult.result}] ${name}`);
  
  if (error) {
    console.error(`   Error: ${error.message}`);
  }
}

async function getAuthToken(userType) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: testUsers[userType].email,
    password: testUsers[userType].password
  });
  return response.data.accessToken;
}

// Test Functions
async function testHealthCheck() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    logTest('Health Check', response.data.status === 'ok');
  } catch (error) {
    logTest('Health Check', false, error);
    throw error;
  }
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication');
  
  for (const [userType, user] of Object.entries(testUsers)) {
    try {
      // Test login
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      logTest(`Login ${userType} user`, response.data.accessToken !== undefined);
      
    } catch (error) {
      // If login fails, try to register
      if (error.response && error.response.status === 401) {
        try {
          const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, user);
          logTest(`Register ${userType} user`, registerResponse.data.user !== undefined);
          
          // Try login again after registration
          const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: user.email,
            password: user.password
          });
          logTest(`Login ${userType} user after registration`, loginResponse.data.accessToken !== undefined);
          
        } catch (registerError) {
          logTest(`Authentication for ${userType}`, false, registerError);
          throw registerError;
        }
      } else {
        logTest(`Authentication for ${userType}`, false, error);
        throw error;
      }
    }
  }
}

async function testProviderEndpoints() {
  console.log('\n👷 Testing Provider Endpoints');
  
  try {
    const token = await getAuthToken('customer');
    
    // Test get all providers
    const providersResponse = await axios.get(`${API_BASE_URL}/providers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('Get all providers', Array.isArray(providersResponse.data));
    
    // Test get provider by ID
    if (providersResponse.data.length > 0) {
      const providerId = providersResponse.data[0].id;
      const providerResponse = await axios.get(`${API_BASE_URL}/providers/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logTest('Get provider by ID', providerResponse.data.id === providerId);
    }
    
  } catch (error) {
    logTest('Provider endpoints', false, error);
    throw error;
  }
}

async function testBookingEndpoints() {
  console.log('\n📅 Testing Booking Endpoints');
  
  try {
    const customerToken = await getAuthToken('customer');
    const providerToken = await getAuthToken('provider');
    
    // Get providers for booking
    const providersResponse = await axios.get(`${API_BASE_URL}/providers`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    
    if (providersResponse.data.length > 0) {
      const providerId = providersResponse.data[0].id;
      
      // Test create booking
      const bookingData = {
        providerId,
        serviceType: 'plumbing',
        description: 'Test booking from API test suite',
        scheduledAt: '2026-07-15T10:00:00Z',
        customerAddress: '123 Test St, Berlin'
      };
      
      const bookingResponse = await axios.post(
        `${API_BASE_URL}/bookings`,
        bookingData,
        { headers: { Authorization: `Bearer ${customerToken}` } }
      );
      logTest('Create booking', bookingResponse.data.id !== undefined);
      
      const bookingId = bookingResponse.data.id;
      
      // Test get booking by ID
      const getBookingResponse = await axios.get(
        `${API_BASE_URL}/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${customerToken}` } }
      );
      logTest('Get booking by ID', getBookingResponse.data.id === bookingId);
      
      // Test update booking status
      const updateResponse = await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/status`,
        { status: 'accepted' },
        { headers: { Authorization: `Bearer ${providerToken}` } }
      );
      logTest('Update booking status', updateResponse.data.status === 'accepted');
      
      // Test get bookings by provider
      const providerBookingsResponse = await axios.get(
        `${API_BASE_URL}/bookings/provider/${providerId}`,
        { headers: { Authorization: `Bearer ${providerToken}` } }
      );
      logTest('Get bookings by provider', Array.isArray(providerBookingsResponse.data));
      
      // Test get bookings by customer
      const customerBookingsResponse = await axios.get(
        `${API_BASE_URL}/bookings/customer/${bookingResponse.data.customerId}`,
        { headers: { Authorization: `Bearer ${customerToken}` } }
      );
      logTest('Get bookings by customer', Array.isArray(customerBookingsResponse.data));
    }
    
  } catch (error) {
    logTest('Booking endpoints', false, error);
    throw error;
  }
}

function generateSummary() {
  const passedTests = testResults.filter(t => t.result === '✅ PASS').length;
  const failedTests = testResults.filter(t => t.result === '❌ FAIL').length;
  const totalTests = testResults.length;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📋 Total: ${totalTests}`);
  console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log('='.repeat(50));
}

// Run the test suite
runTests();