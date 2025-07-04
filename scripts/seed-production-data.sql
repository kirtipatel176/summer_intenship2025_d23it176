-- Seed production data for DealSense
-- This script populates the database with realistic product data

BEGIN;

-- Insert platforms
INSERT INTO platforms (id, name, base_url, logo_url, affiliate_id, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Amazon', 'https://amazon.in', '/platforms/amazon.png', 'dealsense-21', true),
('22222222-2222-2222-2222-222222222222', 'Flipkart', 'https://flipkart.com', '/platforms/flipkart.png', 'dealsense', true),
('33333333-3333-3333-3333-333333333333', 'Reliance Digital', 'https://reliancedigital.in', '/platforms/reliance-digital.png', null, true)
ON CONFLICT (name) DO UPDATE SET
    base_url = EXCLUDED.base_url,
    logo_url = EXCLUDED.logo_url,
    affiliate_id = EXCLUDED.affiliate_id,
    is_active = EXCLUDED.is_active;

-- Insert sample products with realistic data
INSERT INTO products (id, name, description, category, image_url, brand, model, rating, review_count, is_active) VALUES
-- Smartphones
('550e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro 128GB', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 3x telephoto lens', 'Smartphones', '/placeholder.svg?height=300&width=300', 'Apple', 'iPhone 15 Pro', 4.5, 1250, true),
('550e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24 Ultra 256GB', 'Premium Android smartphone with S Pen, 200MP camera, AI features, and 6.8-inch Dynamic AMOLED display', 'Smartphones', '/placeholder.svg?height=300&width=300', 'Samsung', 'Galaxy S24 Ultra', 4.3, 890, true),
('550e8400-e29b-41d4-a716-446655440003', 'OnePlus 12 256GB', 'Flagship killer with Snapdragon 8 Gen 3, 50MP Hasselblad camera, and 100W fast charging', 'Smartphones', '/placeholder.svg?height=300&width=300', 'OnePlus', 'OnePlus 12', 4.4, 567, true),
('550e8400-e29b-41d4-a716-446655440004', 'Google Pixel 8 Pro 128GB', 'AI-powered photography with Magic Eraser, 7 years of updates, and pure Android experience', 'Smartphones', '/placeholder.svg?height=300&width=300', 'Google', 'Pixel 8 Pro', 4.2, 423, true),

-- Laptops
('550e8400-e29b-41d4-a716-446655440005', 'MacBook Air M3 13-inch 256GB', 'Ultra-thin laptop with M3 chip, 18-hour battery life, and Liquid Retina display', 'Laptops', '/placeholder.svg?height=300&width=300', 'Apple', 'MacBook Air M3', 4.7, 789, true),
('550e8400-e29b-41d4-a716-446655440006', 'Dell XPS 13 Plus Intel i7 512GB', 'Premium ultrabook with 13.4-inch OLED display, Intel 12th gen processor, and sleek design', 'Laptops', '/placeholder.svg?height=300&width=300', 'Dell', 'XPS 13 Plus', 4.3, 345, true),
('550e8400-e29b-41d4-a716-446655440007', 'HP Spectre x360 14 Intel i7 1TB', 'Convertible laptop with 360-degree hinge, Intel Evo platform, and premium build quality', 'Laptops', '/placeholder.svg?height=300&width=300', 'HP', 'Spectre x360 14', 4.1, 234, true),
('550e8400-e29b-41d4-a716-446655440008', 'Lenovo ThinkPad X1 Carbon Gen 11', 'Business laptop with military-grade durability, Intel 13th gen processor, and excellent keyboard', 'Laptops', '/placeholder.svg?height=300&width=300', 'Lenovo', 'ThinkPad X1 Carbon', 4.5, 456, true),

-- Headphones
('550e8400-e29b-41d4-a716-446655440009', 'Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise canceling with premium sound quality and 30-hour battery life', 'Headphones', '/placeholder.svg?height=300&width=300', 'Sony', 'WH-1000XM5', 4.6, 2340, true),
('550e8400-e29b-41d4-a716-446655440010', 'Apple AirPods Pro 2nd Gen', 'Active noise cancellation, spatial audio, and seamless Apple ecosystem integration', 'Headphones', '/placeholder.svg?height=300&width=300', 'Apple', 'AirPods Pro 2', 4.4, 1890, true),
('550e8400-e29b-41d4-a716-446655440011', 'Bose QuietComfort 45', 'Legendary noise cancellation with balanced sound and all-day comfort', 'Headphones', '/placeholder.svg?height=300&width=300', 'Bose', 'QuietComfort 45', 4.3, 1234, true),

-- Tablets
('550e8400-e29b-41d4-a716-446655440012', 'iPad Pro 12.9-inch M2 256GB', 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support', 'Tablets', '/placeholder.svg?height=300&width=300', 'Apple', 'iPad Pro 12.9', 4.4, 678, true),
('550e8400-e29b-41d4-a716-446655440013', 'Samsung Galaxy Tab S9 Ultra 256GB', 'Large 14.6-inch AMOLED display, S Pen included, and desktop-class performance', 'Tablets', '/placeholder.svg?height=300&width=300', 'Samsung', 'Galaxy Tab S9 Ultra', 4.2, 345, true),

-- Smartwatches
('550e8400-e29b-41d4-a716-446655440014', 'Apple Watch Series 9 45mm GPS', 'Advanced health monitoring, fitness tracking, and seamless iPhone integration', 'Smartwatches', '/placeholder.svg?height=300&width=300', 'Apple', 'Watch Series 9', 4.5, 1567, true),
('550e8400-e29b-41d4-a716-446655440015', 'Samsung Galaxy Watch 6 Classic 47mm', 'Rotating bezel, comprehensive health tracking, and premium stainless steel design', 'Smartwatches', '/placeholder.svg?height=300&width=300', 'Samsung', 'Galaxy Watch 6 Classic', 4.2, 789, true)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    image_url = EXCLUDED.image_url,
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert current prices for all products
INSERT INTO product_prices (product_id, platform_id, price, original_price, discount_percentage, product_url, in_stock, last_updated) VALUES
-- iPhone 15 Pro prices
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 134900, 149900, 10, 'https://amazon.in/dp/iphone15pro', true, NOW()),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 139900, 149900, 7, 'https://flipkart.com/iphone-15-pro', true, NOW()),
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 142900, 149900, 5, 'https://reliancedigital.in/iphone-15-pro', false, NOW()),

-- Samsung Galaxy S24 Ultra prices
('550e8400-e29b-41d4-a716-446655440002', '11111111-1111-1111-1111-111111111111', 124999, 139999, 11, 'https://amazon.in/dp/galaxys24ultra', true, NOW()),
('550e8400-e29b-41d4-a716-446655440002', '22222222-2222-2222-2222-222222222222', 119999, 139999, 14, 'https://flipkart.com/samsung-galaxy-s24-ultra', true, NOW()),
('550e8400-e29b-41d4-a716-446655440002', '33333333-3333-3333-3333-333333333333', 129999, 139999, 7, 'https://reliancedigital.in/samsung-galaxy-s24-ultra', true, NOW()),

-- OnePlus 12 prices
('550e8400-e29b-41d4-a716-446655440003', '11111111-1111-1111-1111-111111111111', 64999, 69999, 7, 'https://amazon.in/dp/oneplus12', true, NOW()),
('550e8400-e29b-41d4-a716-446655440003', '22222222-2222-2222-2222-222222222222', 62999, 69999, 10, 'https://flipkart.com/oneplus-12', true, NOW()),
('550e8400-e29b-41d4-a716-446655440003', '33333333-3333-3333-3333-333333333333', 67999, 69999, 3, 'https://reliancedigital.in/oneplus-12', true, NOW()),

-- Google Pixel 8 Pro prices
('550e8400-e29b-41d4-a716-446655440004', '11111111-1111-1111-1111-111111111111', 89999, 99999, 10, 'https://amazon.in/dp/pixel8pro', true, NOW()),
('550e8400-e29b-41d4-a716-446655440004', '22222222-2222-2222-2222-222222222222', 87999, 99999, 12, 'https://flipkart.com/google-pixel-8-pro', true, NOW()),
('550e8400-e29b-41d4-a716-446655440004', '33333333-3333-3333-3333-333333333333', 92999, 99999, 7, 'https://reliancedigital.in/google-pixel-8-pro', true, NOW()),

-- MacBook Air M3 prices
('550e8400-e29b-41d4-a716-446655440005', '11111111-1111-1111-1111-111111111111', 114900, 119900, 4, 'https://amazon.in/dp/macbookairm3', true, NOW()),
('550e8400-e29b-41d4-a716-446655440005', '22222222-2222-2222-2222-222222222222', 117900, 119900, 2, 'https://flipkart.com/macbook-air-m3', true, NOW()),
('550e8400-e29b-41d4-a716-446655440005', '33333333-3333-3333-3333-333333333333', 119900, null, null, 'https://reliancedigital.in/macbook-air-m3', true, NOW()),

-- Sony WH-1000XM5 prices
('550e8400-e29b-41d4-a716-446655440009', '11111111-1111-1111-1111-111111111111', 24990, 29990, 17, 'https://amazon.in/dp/sonywh1000xm5', true, NOW()),
('550e8400-e29b-41d4-a716-446655440009', '22222222-2222-2222-2222-222222222222', 26990, 29990, 10, 'https://flipkart.com/sony-wh1000xm5', true, NOW()),
('550e8400-e29b-41d4-a716-446655440009', '33333333-3333-3333-3333-333333333333', 28990, 29990, 3, 'https://reliancedigital.in/sony-wh1000xm5', true, NOW()),

-- iPad Pro prices
('550e8400-e29b-41d4-a716-446655440012', '11111111-1111-1111-1111-111111111111', 89900, null, null, 'https://amazon.in/dp/ipadprom2', true, NOW()),
('550e8400-e29b-41d4-a716-446655440012', '22222222-2222-2222-2222-222222222222', 92900, null, null, 'https://flipkart.com/ipad-pro-m2', true, NOW()),
('550e8400-e29b-41d4-a716-446655440012', '33333333-3333-3333-3333-333333333333', 94900, null, null, 'https://reliancedigital.in/ipad-pro-m2', true, NOW())

ON CONFLICT (product_id, platform_id) DO UPDATE SET
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount_percentage = EXCLUDED.discount_percentage,
    product_url = EXCLUDED.product_url,
    in_stock = EXCLUDED.in_stock,
    last_updated = EXCLUDED.last_updated;

-- Insert sample price history (last 3 months)
INSERT INTO price_history (product_id, platform_id, price, original_price, discount_percentage, recorded_at) VALUES
-- iPhone 15 Pro price history
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 149900, 149900, 0, '2024-01-01'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 147900, 149900, 1, '2024-01-15'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 144900, 149900, 3, '2024-02-01'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 139900, 149900, 7, '2024-02-15'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 134900, 149900, 10, '2024-03-01'::timestamp),

-- Flipkart price history for iPhone
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 152900, 149900, 0, '2024-01-01'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 149900, 149900, 0, '2024-01-15'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 147900, 149900, 1, '2024-02-01'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 142900, 149900, 5, '2024-02-15'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 139900, 149900, 7, '2024-03-01'::timestamp),

-- Reliance Digital price history for iPhone
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 154900, 149900, 0, '2024-01-01'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 152900, 149900, 0, '2024-01-15'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 149900, 149900, 0, '2024-02-01'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 147900, 149900, 1, '2024-02-15'::timestamp),
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 142900, 149900, 5, '2024-03-01'::timestamp);

-- Insert sample AI recommendations
INSERT INTO ai_recommendations (product_id, recommendation_type, confidence_score, title, description, reasoning, alternative_products) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'buy_now', 85, 'Great time to buy!', 'Prices are at their lowest in 3 months. Amazon has the best deal.',
 '["Price dropped 15% in the last week", "Historical data shows prices typically rise after this period", "High demand expected during upcoming sale season"]'::jsonb,
 NULL),
('550e8400-e29b-41d4-a716-446655440002', 'alternative', 78, 'Consider this alternative', 'Samsung Galaxy S24 Ultra offers similar features at 20% lower price.',
 '["Similar performance benchmarks to iPhone 15 Pro", "Better value for money", "Longer software support commitment"]'::jsonb,
 '["550e8400-e29b-41d4-a716-446655440001"]'::jsonb),
('550e8400-e29b-41d4-a716-446655440005', 'buy_now', 92, 'Excellent deal available', 'Lowest price in 6 months with limited stock.',
 '["Lowest price in 6 months", "New model launch expected in 6 months", "Current inventory levels are low"]'::jsonb,
 NULL);

COMMIT;
