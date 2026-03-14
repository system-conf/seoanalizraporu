const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: '195.85.207.234',
    user: 'lilideaecomtr_eniyiseohizmeti',
    password: 'diNKN.gRA)~u',
    database: 'lilideaecomtr_eniyiseohizmeti'
  });

  try {
    console.log('Adding timezone and currency columns to users table...');

    // Check if columns exist before adding
    const [columns] = await connection.execute('SHOW COLUMNS FROM users LIKE "timezone"');
    if (columns.length === 0) {
      await connection.execute('ALTER TABLE users ADD COLUMN timezone VARCHAR(10) DEFAULT "utc+3"');
      console.log('Added timezone column');
    }

    const [currencyColumns] = await connection.execute('SHOW COLUMNS FROM users LIKE "currency"');
    if (currencyColumns.length === 0) {
      await connection.execute('ALTER TABLE users ADD COLUMN currency VARCHAR(3) DEFAULT "try"');
      console.log('Added currency column');
    }

    console.log('Creating billing table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS billing (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          plan_name VARCHAR(100) DEFAULT 'Basic Plan',
          plan_price DECIMAL(10, 2) DEFAULT 0.00,
          billing_cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
          payment_method VARCHAR(50),
          card_last4 VARCHAR(4),
          card_expiry VARCHAR(5),
          card_holder VARCHAR(255),
          next_billing_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    console.log('Creating invoices table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          invoice_id VARCHAR(50) NOT NULL,
          invoice_date DATE NOT NULL,
          plan_name VARCHAR(100),
          amount DECIMAL(10, 2) NOT NULL,
          status ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Paid',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create default billing records for existing users
    console.log('Creating default billing records for existing users...');
    const [users] = await connection.execute('SELECT id FROM users');

    for (const user of users) {
      const [existing] = await connection.execute(
        'SELECT id FROM billing WHERE user_id = ?',
        [user.id]
      );
      if (existing.length === 0) {
        await connection.execute(
          `INSERT INTO billing (user_id, plan_name, plan_price, billing_cycle, next_billing_date)
           VALUES (?, 'Basic Plan', 0.00, 'monthly', DATE_ADD(CURDATE(), INTERVAL 1 MONTH))`,
          [user.id]
        );
      }
    }

    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();