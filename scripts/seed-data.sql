-- Seed data for DealSense database
-- This script populates the database with initial data

-- Insert platforms
INSERT INTO platforms (name, base_url, logo_url) VALUES
('Amazon', 'https://amazon.in', '/platforms/amazon.png'),
('Flipkart', 'https://flipkart.com', '/platforms/flipkart.png'),
('Reliance Digital', 'https://reliancedigital.in', '/platforms/reliance-digital.png')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, category, image_url, brand, model, rating, review_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro 128GB', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 'Smartphones', '/placeholder.svg?height=300&width=300', 'Apple', 'iPhone 15 Pro', 4.5, 1250),
('550e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24 Ultra 256GB', 'Premium Android smartphone with S Pen, 200MP camera, and AI features', 'Smartphones', '/placeholder.svg?height=300&width=300', 'Samsung', 'Galaxy S24 Ultra', 4.3, 890),
('550e8400-e29b-41d4-a716-446655440003', 'MacBook Air M3 13-inch 256GB', 'Ultra-thin laptop with M3 chip, all-day battery life, and Liquid Retina display', 'Laptops', '/placeholder.svg?height=300&width=300', 'Apple', 'MacBook Air M3', 4.7, 567),
('550e8400-e29b-41d4-a716-446655440004', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling with premium sound quality', 'Headphones', '/placeholder.svg?height=300&width=300', 'Sony', 'WH-1000XM5', 4.6, 2340),
('550e8400-e29b-41d4-a716-446655440005', 'iPad Pro 12.9-inch M2 256GB', 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support', 'Tablets', '/placeholder.svg?height=300&width=300', 'Apple', 'iPad Pro 12.9', 4.4, 678)
ON CONFLICT (id) DO NOTHING;

-- Insert current prices
WITH platform_ids AS (
    SELECT id, name FROM platforms
),
product_ids AS (
    SELECT id, name FROM products
)
INSERT INTO product_prices (product_id, platform_id, price, original_price, discount_percentage, product_url, in_stock) VALUES
-- iPhone 15 Pro prices
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 134900, 149900, 10, 'https://amazon.in/iphone-15-pro', true),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 139900, 149900, 7, 'https://flipkart.com/iphone-15-pro', true),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 142900, 149900, 5, 'https://reliancedigital.in/iphone-15-pro', false),

-- Samsung Galaxy S24 Ultra prices
((SELECT id FROM product_ids WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 124999, NULL, NULL, 'https://amazon.in/samsung-galaxy-s24-ultra', true),
((SELECT id FROM product_ids WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 119999, NULL, NULL, 'https://flipkart.com/samsung-galaxy-s24-ultra', true),
((SELECT id FROM product_ids WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 129999, NULL, NULL, 'https://reliancedigital.in/samsung-galaxy-s24-ultra', true),

-- MacBook Air M3 prices
((SELECT id FROM product_ids WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 114900, 119900, 4, 'https://amazon.in/macbook-air-m3', true),
((SELECT id FROM product_ids WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 117900, 119900, 2, 'https://flipkart.com/macbook-air-m3', true),
((SELECT id FROM product_ids WHERE name = 'MacBook Air M3 13-inch 256GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 119900, NULL, NULL, 'https://reliancedigital.in/macbook-air-m3', true),

-- Sony WH-1000XM5 prices
((SELECT id FROM product_ids WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 24990, 29990, 17, 'https://amazon.in/sony-wh1000xm5', true),
((SELECT id FROM product_ids WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 26990, 29990, 10, 'https://flipkart.com/sony-wh1000xm5', true),
((SELECT id FROM product_ids WHERE name = 'Sony WH-1000XM5 Wireless Headphones'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 28990, 29990, 3, 'https://reliancedigital.in/sony-wh1000xm5', true),

-- iPad Pro prices
((SELECT id FROM product_ids WHERE name = 'iPad Pro 12.9-inch M2 256GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 89900, NULL, NULL, 'https://amazon.in/ipad-pro-m2', true),
((SELECT id FROM product_ids WHERE name = 'iPad Pro 12.9-inch M2 256GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 92900, NULL, NULL, 'https://flipkart.com/ipad-pro-m2', true),
((SELECT id FROM product_ids WHERE name = 'iPad Pro 12.9-inch M2 256GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 94900, NULL, NULL, 'https://reliancedigital.in/ipad-pro-m2', true)
ON CONFLICT (product_id, platform_id) DO NOTHING;

-- Insert sample price history (last 3 months)
WITH platform_ids AS (
    SELECT id, name FROM platforms
),
product_ids AS (
    SELECT id, name FROM products
)
INSERT INTO price_history (product_id, platform_id, price, original_price, discount_percentage, recorded_at) VALUES
-- iPhone 15 Pro price history
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 149900, 149900, 0, '2024-01-01'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 147900, 149900, 1, '2024-01-15'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 144900, 149900, 3, '2024-02-01'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 139900, 149900, 7, '2024-02-15'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Amazon'), 134900, 149900, 10, '2024-03-01'::timestamp),

-- Flipkart price history for iPhone
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 152900, 149900, 0, '2024-01-01'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 149900, 149900, 0, '2024-01-15'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 147900, 149900, 1, '2024-02-01'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 142900, 149900, 5, '2024-02-15'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Flipkart'), 139900, 149900, 7, '2024-03-01'::timestamp),

-- Reliance Digital price history for iPhone
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 154900, 149900, 0, '2024-01-01'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 152900, 149900, 0, '2024-01-15'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 149900, 149900, 0, '2024-02-01'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 147900, 149900, 1, '2024-02-15'::timestamp),
((SELECT id FROM product_ids WHERE name = 'iPhone 15 Pro 128GB'), (SELECT id FROM platform_ids WHERE name = 'Reliance Digital'), 142900, 149900, 5, '2024-03-01'::timestamp);

-- Insert sample AI recommendations
INSERT INTO ai_recommendations (product_id, recommendation_type, confidence_score, reasoning, alternative_products) VALUES
((SELECT id FROM products WHERE name = 'iPhone 15 Pro 128GB'), 'buy_now', 85, 
 '["Price dropped 15% in the last week", "Historical data shows prices typically rise after this period", "High demand expected during upcoming sale season"]'::jsonb,
 NULL),
((SELECT id FROM products WHERE name = 'Samsung Galaxy S24 Ultra 256GB'), 'alternative', 78,
 '["Similar performance benchmarks to iPhone 15 Pro", "Better value for money", "Longer software support commitment"]'::jsonb,
 '["iPhone 15 Pro 128GB"]'::jsonb),
((SELECT id FROM products WHERE name = 'MacBook Air M3 13-inch 256GB'), 'buy_now', 92,
 '["Lowest price in 6 months", "New model launch expected in 6 months", "Current inventory levels are low"]'::jsonb,
 NULL);
