import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const config: sql.config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 30000,
    connectTimeout: 30000,
  }
};

console.log('=== Database Connection Test ===');
console.log('Environment:', process.env.NODE_ENV);
console.log('Host:', config.server);
console.log('Database:', config.database);
console.log('Username:', config.user);
console.log('Password:', config.password ? '[SET]' : '[MISSING]');
console.log('Port:', config.port);
console.log('================================');

async function testConnection() {
  try {
    console.log('Attempting to connect to MSSQL...');
    const pool = await sql.connect(config);
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    console.log('Testing simple query...');
    const result = await pool.request().query('SELECT 1 as test, GETDATE() as current_datetime');
    console.log('✅ Query test successful:', result.recordset);
    
    // Test if we can access the database
    console.log('Testing database access...');
    const dbResult = await pool.request().query('SELECT DB_NAME() as current_database');
    console.log('✅ Database access test:', dbResult.recordset);
    
    await pool.close();
    console.log('✅ Connection closed successfully.');
    console.log('🎉 All database tests passed!');
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', (err as Error).message);
    console.error('Error code:', (err as any).code);
    console.error('Error number:', (err as any).number);
    console.error('Full error:', err);
    
    // Provide helpful suggestions based on error
    if ((err as any).code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestion: Connection refused. Check if:');
      console.log('   - Database server is running');
      console.log('   - Port 1433 is open');
      console.log('   - Firewall allows connections');
    } else if ((err as any).code === 'ELOGIN') {
      console.log('\n💡 Suggestion: Login failed. Check if:');
      console.log('   - Username and password are correct');
      console.log('   - User has access to the database');
    } else if ((err as any).code === 'ETIMEOUT') {
      console.log('\n💡 Suggestion: Connection timeout. Check if:');
      console.log('   - Network connectivity is stable');
      console.log('   - Database server is not overloaded');
    }
  }
}

testConnection(); 