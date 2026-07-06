const axios = require('axios');

// Test the API directly
async function testApi() {
  console.log('Testing API directly...');
  
  try {
    // Test health check
    console.log('\n1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:3000/api/health');
    console.log('Health check response:', healthResponse.data);
    
    // Test API root
    console.log('\n2. Testing API root...');
    const rootResponse = await axios.get('http://localhost:3000/api/');
    console.log('API root response:', rootResponse.data);
    
    // Test authentication
    console.log('\n3. Testing authentication...');
    const registerResponse = await axios.post('http://localhost:3000/api/auth/register', {
      email: 'testapi@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'API',
      phone: '+49123456789',
      userType: 'customer'
    });
    console.log('Register response:', registerResponse.data);
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'testapi@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data);
    
    const token = loginResponse.data.accessToken;
    
    // Test provider endpoints
    console.log('\n4. Testing provider endpoints...');
    const providersResponse = await axios.get('http://localhost:3000/api/providers');
    console.log('Providers count:', providersResponse.data.length);
    console.log('First provider:', providersResponse.data[0]);
    
    const providerByIdResponse = await axios.get('http://localhost:3000/api/providers/1');
    console.log('Provider by ID:', providerByIdResponse.data);
    
    // Test booking endpoints
    console.log('\n5. Testing booking endpoints...');
    const bookingResponse = await axios.post('http://localhost:3000/api/bookings', {
      providerId: '1',
      serviceType: 'plumbing',
      description: 'Test booking from API test',
      scheduledAt: '2026-07-15T10:00:00Z',
      customerAddress: '123 Test St, Berlin'
    });
    console.log('Booking created:', bookingResponse.data);
    
    // Test with authentication
    console.log('\n6. Testing authenticated requests...');
    const authHeaders = { Authorization: `Bearer ${token}` };
    const bookingsResponse = await axios.get('http://localhost:3000/api/bookings/provider/1', { headers: authHeaders });
    console.log('Bookings for provider 1:', bookingsResponse.data.length);
    
    console.log('\n✅ All API tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

// Start the minimal backend if not already running
const { exec } = require('child_process');
const backendProcess = exec('cd /home/rahul/Documents/urban/minimal-backend && npm run start:dev');

backendProcess.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`Backend error: ${data}`);
});

// Give the backend time to start
setTimeout(testApi, 3000);