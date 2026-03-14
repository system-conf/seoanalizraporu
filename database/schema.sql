-- AdControl Pro Database Schema
-- Remote MySQL Configuration

-- 0. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'customer') DEFAULT 'customer',
    email VARCHAR(255),
    phone VARCHAR(20),
    bio TEXT,
    notifications JSON,
    timezone VARCHAR(10) DEFAULT 'utc+3',
    currency VARCHAR(3) DEFAULT 'try',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 0.1 User Permissions Table
CREATE TABLE IF NOT EXISTS user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    page_key VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, page_key)
) ENGINE=InnoDB;

-- 1. Ad Accounts Table
CREATE TABLE IF NOT EXISTS ad_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform ENUM('Google', 'Meta', 'TikTok') NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    external_account_id VARCHAR(100) NOT NULL,
    status ENUM('Bagli', 'Token Sona Eriyor', 'Baglanti Kesildi') DEFAULT 'Bagli',
    last_sync DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (platform),
    INDEX (user_id)
) ENGINE=InnoDB;

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_account_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    status ENUM('Aktif', 'Duraklatildi', 'Tamamlandi') DEFAULT 'Aktif',
    budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    budget_type ENUM('daily', 'lifetime') DEFAULT 'daily',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_account_id) REFERENCES ad_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Daily Stats Table
CREATE TABLE IF NOT EXISTS daily_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ad_account_id INT NOT NULL,
    campaign_id INT,
    stat_date DATE NOT NULL,
    spend DECIMAL(15, 2) DEFAULT 0.00,
    impressions BIGINT DEFAULT 0,
    clicks INT DEFAULT 0,
    add_to_cart INT DEFAULT 0,
    conversions INT DEFAULT 0,
    revenue DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_account_id) REFERENCES ad_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX (stat_date),
    INDEX (ad_account_id, stat_date)
) ENGINE=InnoDB;

-- 4. Hourly Stats Table
CREATE TABLE IF NOT EXISTS hourly_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ad_account_id INT NOT NULL,
    stat_date DATE NOT NULL,
    hour INT NOT NULL,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    FOREIGN KEY (ad_account_id) REFERENCES ad_accounts(id) ON DELETE CASCADE,
    INDEX (stat_date, hour)
) ENGINE=InnoDB;

-- 5. Device Stats Table
CREATE TABLE IF NOT EXISTS device_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_account_id INT NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    clicks INT DEFAULT 0,
    percentage DECIMAL(5, 2) DEFAULT 0.00,
    FOREIGN KEY (ad_account_id) REFERENCES ad_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Geo Stats Table
CREATE TABLE IF NOT EXISTS geo_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_account_id INT NOT NULL,
    country VARCHAR(100) NOT NULL,
    spend DECIMAL(15, 2) DEFAULT 0.00,
    conversions INT DEFAULT 0,
    FOREIGN KEY (ad_account_id) REFERENCES ad_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Demographic Stats Table
CREATE TABLE IF NOT EXISTS demographic_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_account_id INT NOT NULL,
    age_range VARCHAR(20) NOT NULL,
    gender ENUM('Male', 'Female', 'Unknown') NOT NULL,
    percentage DECIMAL(5, 2) DEFAULT 0.00,
    FOREIGN KEY (ad_account_id) REFERENCES ad_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Billing Table
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
) ENGINE=InnoDB;

-- 9. Invoices Table
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
) ENGINE=InnoDB;

