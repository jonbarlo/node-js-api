const fs = require('fs');
const path = require('path');

console.log('=== IIS Context Test ===');
console.log('Process ID:', process.pid);
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Check if we're running under IIS
const isIIS = process.env.IIS_NODE_VERSION || process.env.IIS_SITE_NAME;
console.log('Running under IIS:', !!isIIS);

// Try to load the minimal app and see what happens
try {
    console.log('\n=== Loading minimal app ===');
    const minimalPath = path.join(process.cwd(), 'dist', 'scripts', 'test-minimal-ts.js');
    
    if (fs.existsSync(minimalPath)) {
        console.log('✅ Minimal app file exists');
        
        // Read the file content to see what's actually in it
        const content = fs.readFileSync(minimalPath, 'utf8');
        console.log('✅ File content (first 200 chars):');
        console.log(content.substring(0, 200));
        
        // Check if it has config service
        const hasConfigService = content.includes('configService');
        console.log('✅ Has config service:', hasConfigService);
        
        // Check if it has dotenv
        const hasDotenv = content.includes('dotenv');
        console.log('✅ Has dotenv:', hasDotenv);
        
        // Try to require it
        console.log('\n=== Requiring minimal app ===');
        const app = require(minimalPath);
        console.log('✅ App loaded successfully');
        
        // Check environment variables after loading
        console.log('\n=== Environment after loading app ===');
        const vars = ['NODE_ENV', 'DB_HOST', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD', 'DB_PORT'];
        vars.forEach(varName => {
            const value = process.env[varName];
            console.log(`${varName}: ${value ? (varName.includes('PASSWORD') ? '[SET]' : value) : '[MISSING]'}`);
        });
        
    } else {
        console.log('❌ Minimal app file not found');
    }
} catch (error) {
    console.error('❌ Error:', error);
}

console.log('\n=== Test Complete ==='); 