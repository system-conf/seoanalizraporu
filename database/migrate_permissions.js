const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: '195.85.207.234',
    user: 'lilideaecomtr_eniyiseohizmeti',
    password: 'diNKN.gRA)~u',
    database: 'lilideaecomtr_eniyiseohizmeti'
  });

  try {
    console.log('Creating user_permissions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_permissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          page_key VARCHAR(50) NOT NULL,
          is_enabled BOOLEAN DEFAULT TRUE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY (user_id, page_key)
      ) ENGINE=InnoDB
    `);
    
    // Default permissions for existing users
    const [users] = await connection.execute('SELECT id FROM users');
    const pages = ['dashboard', 'accounts', 'campaigns', 'reports', 'analytics', 'team', 'settings', 'users'];
    
    for (const user of users) {
      for (const page of pages) {
        await connection.execute(
          'INSERT IGNORE INTO user_permissions (user_id, page_key, is_enabled) VALUES (?, ?, ?)',
          [user.id, page, true]
        );
      }
    }
    
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
