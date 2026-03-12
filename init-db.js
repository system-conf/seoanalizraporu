require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  console.log('Initializing database on:', process.env.DB_HOST);
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      multipleStatements: true
    });

    console.log('Cleaning up old tables...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DROP TABLE IF EXISTS daily_stats, campaigns, ad_accounts, users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema.sql...');
    await connection.query(schemaSql);
    console.log('✅ Database initialized successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error(error.message);
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase();
