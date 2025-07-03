import fs from 'fs';
import path from 'path';

console.log('=== Comprehensive IIS Environment Test ===');
console.log('Current directory:', process.cwd());

// Test 1: Check if .env file was copied during deployment
console.log('\n🔍 TEST 1: Deployment File Check');
const envPath = path.join(process.cwd(), '.env');
const envProdPath = path.join(process.cwd(), '.env.prod');

try {
    const envExists = fs.existsSync(envPath);
    const envProdExists = fs.existsSync(envProdPath);
    
    console.log(`✅ .env file exists: ${envExists}`);
    console.log(`✅ .env.prod file exists: ${envProdExists}`);
    
    if (envExists) {
        const stats = fs.statSync(envPath);
        console.log(`✅ .env file size: ${stats.size} bytes`);
        console.log(`✅ .env file modified: ${stats.mtime}`);
        
        // Read content to verify it's the right file
        const content = fs.readFileSync(envPath, 'utf8');
        const hasDbHost = content.includes('DB_HOST=');
        const hasDbPassword = content.includes('DB_PASSWORD=');
        console.log(`✅ .env contains DB_HOST: ${hasDbHost}`);
        console.log(`✅ .env contains DB_PASSWORD: ${hasDbPassword}`);
    }
} catch (error) {
    console.error('❌ Error checking .env files:', error);
}

// Test 2: Check if .env file is being loaded by the app
console.log('\n🔍 TEST 2: .env Loading Test');
try {
    // Try to load with dotenv
    const dotenv = require('dotenv');
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        console.error('❌ dotenv loading failed:', result.error);
    } else {
        console.log('✅ dotenv loaded successfully');
        console.log(`✅ Parsed ${Object.keys(result.parsed || {}).length} variables`);
        
        // Check specific variables
        const dbHost = process.env.DB_HOST;
        const dbPassword = process.env.DB_PASSWORD;
        console.log(`✅ DB_HOST loaded: ${dbHost ? 'YES' : 'NO'}`);
        console.log(`✅ DB_PASSWORD loaded: ${dbPassword ? 'YES' : 'NO'}`);
    }
} catch (error) {
    console.error('❌ Error testing dotenv loading:', error);
}

// Test 3: Check if IIS is running from a different directory
console.log('\n🔍 TEST 3: IIS Directory Check');
console.log('Current working directory:', process.cwd());

// Check if we're in the expected directory structure
const expectedFiles = [
    'package.json',
    'web.config',
    'dist/test-minimal.js',
    'node_modules/express'
];

expectedFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const exists = fs.existsSync(filePath);
    console.log(`✅ ${file} exists: ${exists}`);
});

// Check if we're in the right directory by looking for typical IIS paths
const currentDir = process.cwd();
const isIisPath = currentDir.includes('Inetpub') || currentDir.includes('wwwroot');
console.log(`✅ Running in IIS directory: ${isIisPath}`);

console.log('\n=== Test Complete ===');
console.log('This test covers all three potential issues:');
console.log('1. ✅ Deployment file copying');
console.log('2. ✅ .env file loading');
console.log('3. ✅ IIS directory structure'); 