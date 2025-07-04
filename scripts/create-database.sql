-- Create DealSense database with all required tables and relationships
-- Run this script in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS price_alerts CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS product_prices CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS platforms CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platforms table
CREATE TABLE platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    base_url VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    affiliate_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    brand VARCHAR(100),
    model VARCHAR(100),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_prices table (current prices)
CREATE TABLE product_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(12,2) CHECK (original_price >= price),
    discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    product_url VARCHAR(1000) NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, platform_id)
);

-- Create price_history table
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(12,2) CHECK (original_price >= price),
    discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    in_stock BOOLEAN DEFAULT true,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price_alerts table
CREATE TABLE price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE CASCADE,
    target_price DECIMAL(12,2) NOT NULL CHECK (target_price > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    triggered_at TIMESTAMP WITH TIME ZONE,
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create ai_recommendations table
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('buy_now', 'wait', 'alternative')),
    confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reasoning JSONB NOT NULL,
    alternative_products JSONB,
    best_platform VARCHAR(100),
    estimated_savings DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_name_gin ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_description_gin ON products USING gin(to_tsvector('english', description));
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

CREATE INDEX idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX idx_product_prices_platform_id ON product_prices(platform_id);
CREATE INDEX idx_product_prices_price ON product_prices(price);
CREATE INDEX idx_product_prices_updated ON product_prices(last_updated);

CREATE INDEX idx_price_history_product_platform ON price_history(product_id, platform_id);
CREATE INDEX idx_price_history_recorded_at ON price_history(recorded_at);
CREATE INDEX idx_price_history_price ON price_history(price);

CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_product_id ON price_alerts(product_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_price_alerts_target_price ON price_alerts(target_price);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_product_id ON user_favorites(product_id);

CREATE INDEX idx_ai_recommendations_product_id ON ai_recommendations(product_id);
CREATE INDEX idx_ai_recommendations_expires_at ON ai_recommendations(expires_at);
CREATE INDEX idx_ai_recommendations_type ON ai_recommendations(recommendation_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update last_updated in product_prices
CREATE OR REPLACE FUNCTION update_price_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_prices_timestamp
    BEFORE UPDATE ON product_prices
    FOR EACH ROW EXECUTE FUNCTION update_price_timestamp();

-- Create function to clean up expired AI recommendations
CREATE OR REPLACE FUNCTION cleanup_expired_recommendations()
RETURNS void AS $$
BEGIN
    DELETE FROM ai_recommendations WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Create function to check price alerts
CREATE OR REPLACE FUNCTION check_price_alerts()
RETURNS void AS $$
DECLARE
    alert_record RECORD;
    current_price DECIMAL(12,2);
BEGIN
    FOR alert_record IN 
        SELECT pa.*, p.name as product_name, u.email
        FROM price_alerts pa
        JOIN products p ON pa.product_id = p.id
        JOIN users u ON pa.user_id = u.id
        WHERE pa.is_active = true
        AND pa.last_checked < NOW() - INTERVAL '1 hour'
    LOOP
        -- Get current lowest price for the product
        SELECT MIN(pp.price) INTO current_price
        FROM product_prices pp
        WHERE pp.product_id = alert_record.product_id
        AND (alert_record.platform_id IS NULL OR pp.platform_id = alert_record.platform_id)
        AND pp.in_stock = true;

        -- Update last_checked
        UPDATE price_alerts 
        SET last_checked = NOW()
        WHERE id = alert_record.id;

        -- Check if price dropped below target
        IF current_price IS NOT NULL AND current_price <= alert_record.target_price THEN
            UPDATE price_alerts 
            SET triggered_at = NOW(), is_active = false
            WHERE id = alert_record.id;
            
            -- Here you would trigger email notification
            -- For now, we'll just log it
            RAISE NOTICE 'Price alert triggered for user % - Product: % - Target: % - Current: %', 
                alert_record.email, alert_record.product_name, alert_record.target_price, current_price;
        END IF;
    END LOOP;
END;
$$ language 'plpgsql';

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users
    FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Users can manage their own price alerts" ON price_alerts
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own favorites" ON user_favorites
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Allow public read access to products, platforms, and prices
CREATE POLICY "Public read access to products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access to platforms" ON platforms
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access to product prices" ON product_prices
    FOR SELECT USING (true);

CREATE POLICY "Public read access to price history" ON price_history
    FOR SELECT USING (true);

CREATE POLICY "Public read access to AI recommendations" ON ai_recommendations
    FOR SELECT USING (expires_at > NOW());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE ON users, price_alerts, user_favorites TO authenticated;

-- Create a view for product search with prices
CREATE OR REPLACE VIEW product_search_view AS
SELECT 
    p.*,
    json_agg(
        json_build_object(
            'platform_name', pl.name,
            'platform_logo', pl.logo_url,
            'price', pp.price,
            'original_price', pp.original_price,
            'discount_percentage', pp.discount_percentage,
            'product_url', pp.product_url,
            'in_stock', pp.in_stock,
            'last_updated', pp.last_updated
        )
    ) as platform_prices,
    MIN(pp.price) as lowest_price,
    MAX(pp.price) as highest_price,
    COUNT(pp.id) as platform_count
FROM products p
LEFT JOIN product_prices pp ON p.id = pp.product_id
LEFT JOIN platforms pl ON pp.platform_id = pl.id
WHERE p.is_active = true
GROUP BY p.id;

-- Grant access to the view
GRANT SELECT ON product_search_view TO anon, authenticated;

COMMIT;
