const axios = require('axios');

// Test the Provider App API integration
async function testProviderApp() {
  console.log('Testing Provider App API integration...');
  
  try {
    // Test authentication
    console.log('\n1. Testing authentication...');
    const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
      email: 'provider@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Provider',
      phone: '+49123456789',
      userType: 'provider'
    });
    console.log('Register response:', registerResponse.data.user);
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'provider@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data.user);
    
    const token = loginResponse.data.accessToken;
    
    // Test provider endpoints
    console.log('\n2. Testing provider endpoints...');
    const providersResponse = await axios.get('http://localhost:3000/api/providers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Providers count:', providersResponse.data.length);
    
    const providerByIdResponse = await axios.get(
      `http://localhost:3000/api/providers/${loginResponse.data.user.id}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Provider by ID:', providerByIdResponse.data);
    
    // Test job requests
    console.log('\n3. Testing job requests...');
    const bookingsResponse = await axios.get(
      `http://localhost:3000/api/bookings/provider/${loginResponse.data.user.id}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Job requests count:', bookingsResponse.data.length);
    
    // Test booking status update
    console.log('\n4. Testing booking status update...');
    if (bookingsResponse.data.length > 0) {
      const firstBooking = bookingsResponse.data[0];
      const updateResponse = await axios.put(
        `http://localhost:3000/api/bookings/${firstBooking.id}/status`,
        { status: 'accepted' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('Booking status update:', updateResponse.data);
    }
    
    console.log('\n✅ All Provider App API tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error testing Provider App API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Start the test
testProviderApp();