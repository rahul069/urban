const UrbanApiClient = require('./libs/api-client/dist').default;
const fs = require('fs');
const path = require('path');

// Test the Provider App API integration
async function testProviderApp() {
  console.log('Testing Provider App API integration...');
  
  // Initialize the API client
  const apiClient = new UrbanApiClient('http://localhost:3000/api');
  
  try {
    // Test authentication
    console.log('\n1. Testing authentication...');
    const registerResponse = await apiClient.register({
      email: 'provider@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Provider',
      phone: '+49123456789',
      userType: 'provider'
    });
    console.log('Register response:', registerResponse.data.user);
    
    const loginResponse = await apiClient.login({
      email: 'provider@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data.user);
    
    const token = loginResponse.data.accessToken;
    apiClient.setAuth(token);
    
    // Test document upload
    console.log('\n2. Testing document upload...');
    
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-document.pdf');
    fs.writeFileSync(testFilePath, 'Test document content');
    
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(testFilePath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    
    // Test different document types
    const documentTypes = ['meisterbrief', 'idCard', 'insurance', 'bankStatement'];
    
    for (const docType of documentTypes) {
      console.log(`Uploading ${docType}...`);
      const metadata = {
        hwkNumber: docType === 'meisterbrief' ? 'HWK123456' : undefined,
        insuranceNumber: docType === 'insurance' ? 'INS123456' : undefined,
        iban: docType === 'bankStatement' ? 'DE89370400440532013000' : undefined,
      };
      
      const uploadResponse = await apiClient.uploadProviderDocument(
        loginResponse.data.user.id,
        docType,
        blob,
        metadata
      );
      console.log(`${docType} upload response:`, uploadResponse.data);
    }
    
    // Test verification status
    console.log('\n3. Testing verification status...');
    const verificationResponse = await apiClient.getProviderVerificationStatus(
      loginResponse.data.user.id
    );
    console.log('Verification status:', verificationResponse.data);
    
    // Test job requests
    console.log('\n4. Testing job requests...');
    const bookingsResponse = await apiClient.getBookingsByProvider(
      loginResponse.data.user.id
    );
    console.log('Job requests count:', bookingsResponse.data.length);
    
    console.log('\n✅ All Provider App API tests completed successfully!');
    
    // Clean up
    fs.unlinkSync(testFilePath);
    
  } catch (error) {
    console.error('\n❌ Error testing Provider App API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
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
setTimeout(testProviderApp, 3000);