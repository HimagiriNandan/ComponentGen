const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/accio-job

# Google GenAI Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_api_key_here
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log('📝 Please edit the .env file and replace "your_google_api_key_here" with your actual Google API key');
  console.log('🔗 Get your API key from: https://makersuite.google.com/app/apikey');
} else {
  console.log('📁 .env file already exists');
  console.log('📝 Make sure GOOGLE_API_KEY is set in your .env file');
} 