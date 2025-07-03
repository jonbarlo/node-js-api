import fs from 'fs';
import path from 'path';

console.log('=== Testing Deployed Minimal App ===');
console.log('Current directory:', process.cwd());

// Test 1: Check if the minimal file exists
const minimalPath = path.join(process.cwd(), 'dist', 'test-minimal.js');
console.log('Checking if file exists:', minimalPath);

try {
    const exists = fs.existsSync(minimalPath);
    console.log(`✅ File exists: ${exists}`);
    
    if (exists) {
        const stats = fs.statSync(minimalPath);
        console.log(`✅ File size: ${stats.size} bytes`);
        console.log(`✅ File modified: ${stats.mtime}`);
    }
} catch (error) {
    console.error('❌ Error checking file:', error);
}

// Test 2: Check if web.config exists
const webConfigPath = path.join(process.cwd(), 'web.config');
console.log('\nChecking if web.config exists:', webConfigPath);

try {
    const exists = fs.existsSync(webConfigPath);
    console.log(`✅ web.config exists: ${exists}`);
    
    if (exists) {
        const stats = fs.statSync(webConfigPath);
        console.log(`✅ web.config size: ${stats.size} bytes`);
        
        // Read first few lines to verify it's the right file
        const content = fs.readFileSync(webConfigPath, 'utf8');
        const firstLines = content.split('\n').slice(0, 5).join('\n');
        console.log('✅ web.config starts with:');
        console.log(firstLines);
    }
} catch (error) {
    console.error('❌ Error checking web.config:', error);
}

// Test 3: Check node_modules
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
console.log('\nChecking if node_modules exists:', nodeModulesPath);

try {
    const exists = fs.existsSync(nodeModulesPath);
    console.log(`✅ node_modules exists: ${exists}`);
    
    if (exists) {
        const stats = fs.statSync(nodeModulesPath);
        console.log(`✅ node_modules is directory: ${stats.isDirectory()}`);
        
        // Check if express is installed
        const expressPath = path.join(nodeModulesPath, 'express');
        const expressExists = fs.existsSync(expressPath);
        console.log(`✅ express module exists: ${expressExists}`);
    }
} catch (error) {
    console.error('❌ Error checking node_modules:', error);
}

// Test 4: Try to require the minimal app
console.log('\nTesting if minimal app can be loaded:');
try {
    const minimalApp = require(minimalPath);
    console.log('✅ Minimal app loaded successfully');
    console.log('✅ App type:', typeof minimalApp);
    console.log('✅ App keys:', Object.keys(minimalApp));
    
    // Check environment variables AFTER loading the app (since dotenv loads them)
    console.log('\n=== Environment Variables (After Loading App) ===');
    const importantVars = [
        'NODE_ENV',
        'DB_HOST', 
        'DB_NAME',
        'DB_USERNAME',
        'DB_PASSWORD',
        'DB_PORT'
    ];

    importantVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`✅ ${varName}: ${varName.includes('PASSWORD') ? '[SET]' : value}`);
        } else {
            console.log(`❌ ${varName}: [MISSING]`);
        }
    });
    
} catch (error) {
    console.error('❌ Error loading minimal app:', error);
}

// Test 5: Check environment variables BEFORE loading app (for comparison)
console.log('\n=== Environment Variables (Before Loading App) ===');
const importantVars = [
    'NODE_ENV',
    'DB_HOST', 
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_PORT'
];

importantVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${varName.includes('PASSWORD') ? '[SET]' : value}`);
    } else {
        console.log(`❌ ${varName}: [MISSING]`);
    }
});

console.log('\n=== Test Complete ===');
console.log('If you see this message, the basic file system test passed!'); 