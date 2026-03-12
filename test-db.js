require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Connection successful!');
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Test Query Result:', rows[0].result);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error.message);
  }
}

testConnection();
