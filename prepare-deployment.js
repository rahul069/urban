const fs = require('fs');
const path = require('path');

// Prepare deployment for all apps
function prepareDeployment() {
  console.log('Preparing deployment...');
  
  // Create production environment files
  createProductionEnv('customer');
  createProductionEnv('ProviderAppNew');
  createProductionEnv('admin');
  
  console.log('✅ Deployment preparation complete');
}

function createProductionEnv(appName) {
  const envPath = path.join(__dirname, 'apps', appName, '.env.production');
  let envContent = '';
  
  if (appName === 'customer' || appName === 'ProviderAppNew') {
    envContent = `# Production API Configuration
API_BASE_URL=https://api.urbanhome.services/api

# App Configuration
APP_ENV=production
APP_NAME=Urban ${appName === 'customer' ? 'Customer' : 'Provider'}

# Feature Flags
FEATURE_BOOKING=true
${appName === 'customer' ? 'FEATURE_PAYMENTS=true' : 'FEATURE_JOB_REQUESTS=true'}`;
  } else if (appName === 'admin') {
    envContent = `# Production API Configuration
VITE_API_BASE_URL=https://api.urbanhome.services/api

# App Configuration
VITE_APP_ENV=production
VITE_APP_NAME=Urban Admin

# Feature Flags
VITE_FEATURE_VERIFICATION=true
VITE_FEATURE_BOOKING_MONITOR=true`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Created ${appName} production environment file`);
}

// Run the preparation
prepareDeployment();