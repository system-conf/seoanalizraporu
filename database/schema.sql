-- AdControl Pro Database Schema
-- Remote MySQL Configuration

-- 0. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Sample Data for Testing
INSERT INTO users (username, password, full_name, role)
VALUES 
('admin', 'admin123', 'Sistem Yoneticisi', 'admin'),
('musteri1', 'sifre123', 'Ornek Musteri', 'customer')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO ad_accounts (user_id, platform, account_name, external_account_id, status, last_sync)
VALUES 
(2, 'Google', 'Musteri 1 Google Ads', '123-456-7890', 'Bagli', NOW()),
(2, 'Meta', 'Musteri 1 Meta Ads', 'act_987654321', 'Bagli', NOW())
ON DUPLICATE KEY UPDATE account_name = VALUES(account_name);

INSERT INTO campaigns (ad_account_id, name, status, budget, image_url)
VALUES 
(1, 'Google Ads Bilinirlik Reklami', 'Aktif', 5000.00, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'),
(2, 'Meta Marka Bilinirlik Q1', 'Aktif', 8000.00, 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert Sample Daily Stats
INSERT INTO daily_stats (ad_account_id, campaign_id, stat_date, spend, impressions, clicks, add_to_cart, conversions, revenue)
VALUES 
(1, 1, '2026-03-01', 120.50, 4500, 180, 25, 5, 450.00),
(1, 1, '2026-03-02', 145.20, 5200, 210, 32, 8, 620.00),
(1, 1, '2026-03-03', 130.80, 4800, 195, 28, 6, 510.00),
(2, 2, '2026-03-01', 200.00, 8000, 150, 15, 2, 0.00),
(2, 2, '2026-03-02', 210.00, 8500, 165, 22, 3, 150.00),
(2, 2, '2026-03-03', 195.00, 7800, 140, 18, 2, 80.00)
ON DUPLICATE KEY UPDATE spend = VALUES(spend);
