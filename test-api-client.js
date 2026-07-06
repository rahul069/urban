const UrbanApiClient = require('./libs/api-client/dist').default;
const { useProviders, useBookings, useAuth } = require('./libs/api-client/dist');

// Test the API client
async function testApiClient() {
  console.log('Testing API Client...');
  
  // Initialize the API client
  const apiClient = new UrbanApiClient('http://localhost:3000/api');
  
  try {
    // Test health check
    console.log('\n1. Testing health check...');
    const healthResponse = await apiClient.axiosInstance.get('/health');
    console.log('Health check response:', healthResponse.data);
    
    // Test authentication
    console.log('\n2. Testing authentication...');
    const registerResponse = await apiClient.register({
      email: 'testclient@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Client',
      phone: '+49123456789',
      userType: 'customer'
    });
    console.log('Register response:', registerResponse.data);
    
    const loginResponse = await apiClient.login({
      email: 'testclient@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data);
    
    // Test provider endpoints
    console.log('\n3. Testing provider endpoints...');
    const providersResponse = await apiClient.getProviders();
    console.log('Providers count:', providersResponse.data.length);
    console.log('First provider:', providersResponse.data[0]);
    
    const providerByIdResponse = await apiClient.getProviderById('1');
    console.log('Provider by ID:', providerByIdResponse.data);
    
    // Test booking endpoints
    console.log('\n4. Testing booking endpoints...');
    const bookingResponse = await apiClient.createBooking({
      providerId: '1',
      serviceType: 'plumbing',
      description: 'Test booking from API client',
      scheduledAt: '2026-07-15T10:00:00Z',
      customerAddress: '123 Test St, Berlin'
    });
    console.log('Booking created:', bookingResponse.data);
    
    const bookingsResponse = await apiClient.getBookingsByProvider('1');
    console.log('Bookings for provider 1:', bookingsResponse.data.length);
    
    console.log('\n✅ All API client tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error testing API client:', error.message);
    console.error('Error details:', error);
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
setTimeout(testApiClient, 3000);