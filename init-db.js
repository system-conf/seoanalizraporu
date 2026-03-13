require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
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
    await connection.query('DROP TABLE IF EXISTS demographic_stats, geo_stats, device_stats, hourly_stats, daily_stats, campaigns, ad_accounts, user_permissions, users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema.sql...');
    await connection.query(schemaSql);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'Admin User', 'admin']
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    await connection.query(
      'INSERT INTO ad_accounts (user_id, platform, account_name, external_account_id) VALUES (?, ?, ?, ?)',
      [1, 'Google', 'Google Ads Hesabi', 'GOO-123456']
    );
    await connection.query(
      'INSERT INTO ad_accounts (user_id, platform, account_name, external_account_id) VALUES (?, ?, ?, ?)',
      [1, 'Meta', 'Meta Ads Hesabi', 'META-789012']
    );
    await connection.query(
      'INSERT INTO ad_accounts (user_id, platform, account_name, external_account_id) VALUES (?, ?, ?, ?)',
      [1, 'TikTok', 'TikTok Ads Hesabi', 'TT-345678']
    );
    console.log('✅ Ad accounts created');

    await connection.query(
      'INSERT INTO campaigns (ad_account_id, name, budget, status) VALUES (?, ?, ?, ?)',
      [1, 'Google Search Kampanya 1', 5000, 'Aktif']
    );
    await connection.query(
      'INSERT INTO campaigns (ad_account_id, name, budget, status) VALUES (?, ?, ?, ?)',
      [1, 'Google Display Kampanya', 3000, 'Aktif']
    );
    await connection.query(
      'INSERT INTO campaigns (ad_account_id, name, budget, status) VALUES (?, ?, ?, ?)',
      [2, 'Facebook Feed Kampanya', 4000, 'Aktif']
    );
    await connection.query(
      'INSERT INTO campaigns (ad_account_id, name, budget, status) VALUES (?, ?, ?, ?)',
      [2, 'Instagram Stories Kampanya', 2500, 'Duraklatildi']
    );
    await connection.query(
      'INSERT INTO campaigns (ad_account_id, name, budget, status) VALUES (?, ?, ?, ?)',
      [3, 'TikTok Video Ads', 2000, 'Aktif']
    );
    console.log('✅ Campaigns created');

    const today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      await connection.query(
        'INSERT INTO daily_stats (ad_account_id, campaign_id, stat_date, spend, impressions, clicks, add_to_cart, conversions, revenue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [1, 1, dateStr, 150 + Math.random() * 100, 5000 + Math.floor(Math.random() * 3000), 200 + Math.floor(Math.random() * 100), 50 + Math.floor(Math.random() * 30), 10 + Math.floor(Math.random() * 10), 1500 + Math.floor(Math.random() * 500)]
      );
      await connection.query(
        'INSERT INTO daily_stats (ad_account_id, campaign_id, stat_date, spend, impressions, clicks, add_to_cart, conversions, revenue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [2, 3, dateStr, 200 + Math.random() * 150, 8000 + Math.floor(Math.random() * 4000), 350 + Math.floor(Math.random() * 150), 80 + Math.floor(Math.random() * 40), 15 + Math.floor(Math.random() * 10), 2500 + Math.floor(Math.random() * 800)]
      );
      await connection.query(
        'INSERT INTO daily_stats (ad_account_id, campaign_id, stat_date, spend, impressions, clicks, add_to_cart, conversions, revenue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [3, 5, dateStr, 100 + Math.random() * 80, 3000 + Math.floor(Math.random() * 2000), 150 + Math.floor(Math.random() * 80), 30 + Math.floor(Math.random() * 20), 5 + Math.floor(Math.random() * 5), 800 + Math.floor(Math.random() * 300)]
      );
    }
    console.log('✅ Daily stats created');

    for (let h = 0; h < 24; h++) {
      await connection.query(
        'INSERT INTO hourly_stats (ad_account_id, stat_date, hour, clicks, conversions) VALUES (?, ?, ?, ?, ?)',
        [1, today, h, 10 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 3)]
      );
    }

    await connection.query(
      'INSERT INTO device_stats (ad_account_id, device_type, clicks, percentage) VALUES (?, ?, ?, ?)',
      [1, 'Mobile', 5000, 55.5]
    );
    await connection.query(
      'INSERT INTO device_stats (ad_account_id, device_type, clicks, percentage) VALUES (?, ?, ?, ?)',
      [1, 'Desktop', 3000, 33.3]
    );
    await connection.query(
      'INSERT INTO device_stats (ad_account_id, device_type, clicks, percentage) VALUES (?, ?, ?, ?)',
      [1, 'Tablet', 1000, 11.2]
    );

    await connection.query(
      'INSERT INTO geo_stats (ad_account_id, country, spend, conversions) VALUES (?, ?, ?, ?)',
      [1, 'Turkey', 15000, 120]
    );
    await connection.query(
      'INSERT INTO geo_stats (ad_account_id, country, spend, conversions) VALUES (?, ?, ?, ?)',
      [1, 'Germany', 5000, 45]
    );
    await connection.query(
      'INSERT INTO geo_stats (ad_account_id, country, spend, conversions) VALUES (?, ?, ?, ?)',
      [1, 'United States', 3000, 25]
    );

    const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
    for (const age of ageRanges) {
      await connection.query(
        'INSERT INTO demographic_stats (ad_account_id, age_range, gender, percentage) VALUES (?, ?, ?, ?)',
        [1, age, 'Male', 5 + Math.random() * 15]
      );
      await connection.query(
        'INSERT INTO demographic_stats (ad_account_id, age_range, gender, percentage) VALUES (?, ?, ?, ?)',
        [1, age, 'Female', 5 + Math.random() * 15]
      );
    }

    console.log('✅ Database initialized successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error(error.message);
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase();