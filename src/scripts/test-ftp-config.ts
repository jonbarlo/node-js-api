import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

console.log('🔧 Testing FTP Configuration...\n');

console.log('📁 Environment file path:', envPath);
console.log('📁 Environment file exists:', require('fs').existsSync(envPath));

console.log('\n=== FTP Environment Variables ===');
const ftpVars = [
  'FTP_HOST',
  'FTP_USER', 
  'FTP_PASSWORD',
  'FTP_PORT',
  'FTP_SECURE',
  'FTP_REMOTE_PATH'
];

let missingVars: string[] = [];
ftpVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('PASSWORD')) {
      console.log(`✅ ${varName}: [SET]`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: [MISSING]`);
    missingVars.push(varName);
  }
});

console.log('\n=== Test Results ===');
if (missingVars.length === 0) {
  console.log('✅ All FTP environment variables are set!');
  console.log('You can now run: npm run deploy:ftp');
} else {
  console.log('❌ Missing required FTP environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease add these to your .env file:');
  console.log('FTP_HOST=your-ftp-server.com');
  console.log('FTP_USER=your-username');
  console.log('FTP_PASSWORD=your-password');
  console.log('FTP_PORT=21 (optional, default: 21)');
  console.log('FTP_SECURE=false (optional, default: false)');
  console.log('FTP_REMOTE_PATH=/ (optional, default: /)');
}

console.log('\n=== All Environment Variables ===');
Object.keys(process.env).forEach(key => {
  if (key.includes('FTP_')) {
    const value = process.env[key];
    if (key.includes('PASSWORD')) {
      console.log(`${key}: [HIDDEN]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
}); 