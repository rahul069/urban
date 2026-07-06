const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Test the Provider App API integration directly
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
    
    // Test document upload
    console.log('\n2. Testing document upload...');
    
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-document.pdf');
    fs.writeFileSync(testFilePath, 'Test document content');
    
    // Test different document types
    const documentTypes = ['meisterbrief', 'idCard', 'insurance', 'bankStatement'];
    
    for (const docType of documentTypes) {
      console.log(`Uploading ${docType}...`);
      
      const formData = new FormData();
      formData.append('document', fs.createReadStream(testFilePath));
      
      const metadata = {};
      if (docType === 'meisterbrief') metadata.hwkNumber = 'HWK123456';
      if (docType === 'insurance') metadata.insuranceNumber = 'INS123456';
      if (docType === 'bankStatement') metadata.iban = 'DE89370400440532013000';
      
      if (Object.keys(metadata).length > 0) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      const uploadResponse = await axios.post(
        `http://localhost:3000/api/providers/${loginResponse.data.user.id}/documents/${docType}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${token}`
          },
        }
      );
      console.log(`${docType} upload response:`, uploadResponse.data);
    }
    
    // Test verification status
    console.log('\n3. Testing verification status...');
    const verificationResponse = await axios.get(
      `http://localhost:3000/api/providers/${loginResponse.data.user.id}/verification`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Verification status:', verificationResponse.data);
    
    // Test job requests
    console.log('\n4. Testing job requests...');
    const bookingsResponse = await axios.get(
      `http://localhost:3000/api/bookings/provider/${loginResponse.data.user.id}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
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

// Install form-data if not available
if (!global.FormData) {
  console.log('Installing form-data package...');
  const { execSync } = require('child_process');
  execSync('npm install form-data', { stdio: 'inherit' });
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