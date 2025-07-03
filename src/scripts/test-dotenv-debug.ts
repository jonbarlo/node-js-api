const dotenvDebug = require('dotenv');
const pathDebug = require('path');
const fsDebug = require('fs');

console.log('=== Dotenv Debug Test ===');
console.log('Current directory:', process.cwd());

// Test 1: Check if .env file exists
const envPathDebug = pathDebug.resolve(process.cwd(), '.env');
console.log('Looking for .env file at:', envPathDebug);

try {
    const exists = fsDebug.existsSync(envPathDebug);
    console.log(`✅ .env file exists: ${exists}`);
    
    if (exists) {
        const stats = fsDebug.statSync(envPathDebug);
        console.log(`✅ .env file size: ${stats.size} bytes`);
        
        // Read the file content
        const content = fsDebug.readFileSync(envPathDebug, 'utf8');
        console.log('✅ .env file content:');
        console.log(content);
        
        // Try to load it with dotenv
        console.log('\n=== Testing dotenv loading ===');
        const result = dotenvDebug.config({ path: envPathDebug });
        
        if (result.error) {
            console.error('❌ Error loading .env:', result.error);
        } else {
            console.log('✅ dotenv loaded successfully');
            console.log('✅ Parsed variables:', Object.keys(result.parsed || {}));
            
            // Check specific variables
            console.log('\n=== Checking specific variables ===');
            const vars = ['NODE_ENV', 'DB_HOST', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD', 'DB_PORT'];
            vars.forEach(varName => {
                const value = process.env[varName];
                console.log(`${varName}: ${value ? (varName.includes('PASSWORD') ? '[SET]' : value) : '[MISSING]'}`);
            });
        }
    } else {
        console.log('❌ .env file not found');
        
        // List files in current directory
        console.log('\n=== Files in current directory ===');
        const files = fsDebug.readdirSync(process.cwd());
        files.forEach((file: string) => {
            if (file.includes('env')) {
                console.log(`Found env file: ${file}`);
            }
        });
    }
} catch (error) {
    console.error('❌ Error:', error);
}

console.log('\n=== Test Complete ==='); 