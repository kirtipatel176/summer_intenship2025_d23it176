-- MySQL/PlanetScale setup script
CREATE DATABASE IF NOT EXISTS dealsense;
USE dealsense;

-- Create tables
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE platforms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    base_url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    affiliate_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    brand VARCHAR(100),
    model VARCHAR(100),
    rating DECIMAL(2,1),
    review_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_rating (rating),
    FULLTEXT idx_search (name, description, brand),
    CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE TABLE product_prices (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    platform_id VARCHAR(36) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    discount_percentage INT,
    product_url VARCHAR(1000) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_platform (product_id, platform_id),
    INDEX idx_price (price),
    INDEX idx_updated (last_updated),
    CONSTRAINT chk_price CHECK (price >= 0),
    CONSTRAINT chk_original_price CHECK (original_price IS NULL OR original_price >= price),
    CONSTRAINT chk_discount CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100))
);

CREATE TABLE price_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    platform_id VARCHAR(36) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    discount_percentage INT,
    in_stock BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
    INDEX idx_product_platform_date (product_id, platform_id, recorded_at),
    INDEX idx_recorded_at (recorded_at),
    CONSTRAINT chk_history_price CHECK (price >= 0),
    CONSTRAINT chk_history_original_price CHECK (original_price IS NULL OR original_price >= price),
    CONSTRAINT chk_history_discount CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100))
);

CREATE TABLE price_alerts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    platform_id VARCHAR(36),
    target_price DECIMAL(12,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP NULL,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_active (is_active),
    CONSTRAINT chk_target_price CHECK (target_price > 0)
);

-- Insert sample data
INSERT INTO platforms (id, name, base_url, logo_url, affiliate_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Amazon', 'https://amazon.in', '/platforms/amazon.png', 'dealsense-21'),
('22222222-2222-2222-2222-222222222222', 'Flipkart', 'https://flipkart.com', '/platforms/flipkart.png', 'dealsense'),
('33333333-3333-3333-3333-333333333333', 'Reliance Digital', 'https://reliancedigital.in', '/platforms/reliance-digital.png', NULL);

INSERT INTO products (id, name, description, category, brand, model, rating, review_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro 128GB', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 'Smartphones', 'Apple', 'iPhone 15 Pro', 4.5, 1250),
('550e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24 Ultra 256GB', 'Premium Android smartphone with S Pen, 200MP camera, AI features', 'Smartphones', 'Samsung', 'Galaxy S24 Ultra', 4.3, 890);

INSERT INTO product_prices (product_id, platform_id, price, original_price, discount_percentage, product_url, in_stock) VALUES
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 134900, 149900, 10, 'https://amazon.in/dp/iphone15pro', TRUE),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 139900, 149900, 7, 'https://flipkart.com/iphone-15-pro', TRUE),
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 142900, 149900, 5, 'https://reliancedigital.in/iphone-15-pro', FALSE),
('550e8400-e29b-41d4-a716-446655440002', '11111111-1111-1111-1111-111111111111', 124999, 139999, 11, 'https://amazon.in/dp/galaxys24ultra', TRUE),
('550e8400-e29b-41d4-a716-446655440002', '22222222-2222-2222-2222-222222222222', 119999, 139999, 14, 'https://flipkart.com/samsung-galaxy-s24-ultra', TRUE),
('550e8400-e29b-41d4-a716-446655440002', '33333333-3333-3333-3333-333333333333', 129999, 139999, 7, 'https://reliancedigital.in/samsung-galaxy-s24-ultra', TRUE);

-- Insert sample price history
INSERT INTO price_history (product_id, platform_id, price, original_price, discount_percentage, recorded_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 149900, 149900, 0, '2024-01-01 00:00:00'),
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 134900, 149900, 10, '2024-03-01 00:00:00');

SELECT 'MySQL setup completed successfully!' as message;
