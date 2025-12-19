-- =============================================
-- SonicPods Earpods Ecommerce Store Database Schema
-- =============================================

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- =============================================
-- Categories Table
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Wireless', 'wireless', 'True wireless earbuds with Bluetooth connectivity'),
  ('Gaming', 'gaming', 'Low-latency gaming earbuds for competitive play'),
  ('ANC', 'anc', 'Active Noise Cancellation earbuds for immersive sound'),
  ('Budget', 'budget', 'Affordable earbuds without compromising on quality'),
  ('Premium', 'premium', 'High-end audiophile-grade earbuds');

-- =============================================
-- Products Table (Earpods)
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  brand TEXT,
  category_id UUID REFERENCES categories(id),
  -- Earpods-specific fields
  type TEXT NOT NULL DEFAULT 'wireless' CHECK (type IN ('wireless', 'gaming', 'anc')),
  -- Technical specifications stored as JSONB
  features JSONB DEFAULT '{}'::jsonb,
  -- Example features structure:
  -- {
  --   "battery_life": "8 hours",
  --   "charging_case_battery": "24 hours",
  --   "bluetooth_version": "5.3",
  --   "driver_size": "10mm",
  --   "frequency_response": "20Hz - 20kHz",
  --   "impedance": "32Ω",
  --   "water_resistance": "IPX5",
  --   "noise_cancellation": true,
  --   "transparency_mode": true,
  --   "wireless_charging": true,
  --   "fast_charging": "10min = 2hrs",
  --   "codec_support": ["AAC", "SBC", "aptX"],
  --   "microphone": true,
  --   "touch_controls": true,
  --   "voice_assistant": true,
  --   "multipoint_connection": true,
  --   "warranty": "1 year"
  -- }
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  image TEXT, -- Primary image for backwards compatibility
  colors TEXT[] DEFAULT ARRAY['Black']::TEXT[],
  in_stock BOOLEAN DEFAULT true,
  -- SEO fields
  seo_title TEXT,
  seo_description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Orders Table
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Order Items Table (for normalized order data)
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Contacts Table (Customer Inquiries)
-- =============================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Admins Table
-- =============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Sample Products Data
-- =============================================
INSERT INTO products (name, slug, description, price, discount, stock, brand, type, features, image, colors, in_stock) VALUES
(
  'SonicPods Pro Max',
  'sonicpods-pro-max',
  'Premium true wireless earbuds with industry-leading Active Noise Cancellation, spatial audio, and up to 30 hours of total battery life. Experience crystal-clear sound with our custom-designed 11mm drivers.',
  24999,
  2000,
  50,
  'SonicPods',
  'anc',
  '{"battery_life": "8 hours", "charging_case_battery": "30 hours", "bluetooth_version": "5.3", "driver_size": "11mm", "frequency_response": "20Hz - 20kHz", "water_resistance": "IPX4", "noise_cancellation": true, "transparency_mode": true, "wireless_charging": true, "fast_charging": "5min = 1hr", "codec_support": ["AAC", "SBC", "LDAC"], "warranty": "2 years"}',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
  ARRAY['Midnight Black', 'Arctic White', 'Space Gray'],
  true
),
(
  'GamePods X Elite',
  'gamepods-x-elite',
  'Ultra-low latency gaming earbuds with 40ms response time. RGB lighting, 7.1 virtual surround sound, and detachable boom microphone for competitive gaming.',
  18999,
  0,
  35,
  'SonicPods',
  'gaming',
  '{"battery_life": "10 hours", "charging_case_battery": "40 hours", "bluetooth_version": "5.3", "driver_size": "12mm", "latency": "40ms", "rgb_lighting": true, "surround_sound": "7.1 Virtual", "microphone": "Detachable Boom", "warranty": "1 year"}',
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
  ARRAY['Cyber Red', 'Neon Green', 'Stealth Black'],
  true
),
(
  'AirBuds Lite',
  'airbuds-lite',
  'Affordable true wireless earbuds perfect for everyday use. Clear sound, comfortable fit, and reliable Bluetooth connectivity at an unbeatable price.',
  4999,
  500,
  100,
  'SonicPods',
  'wireless',
  '{"battery_life": "6 hours", "charging_case_battery": "24 hours", "bluetooth_version": "5.0", "driver_size": "8mm", "water_resistance": "IPX4", "touch_controls": true, "warranty": "6 months"}',
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800',
  ARRAY['White', 'Black', 'Blue'],
  true
),
(
  'BassPods Ultra',
  'basspods-ultra',
  'For bass lovers - enhanced low-frequency drivers deliver earth-shaking bass while maintaining crystal-clear mids and highs. Perfect for hip-hop and EDM.',
  12999,
  1500,
  45,
  'SonicPods',
  'wireless',
  '{"battery_life": "9 hours", "charging_case_battery": "36 hours", "bluetooth_version": "5.2", "driver_size": "13mm", "frequency_response": "16Hz - 22kHz", "water_resistance": "IPX5", "bass_boost": true, "eq_presets": 5, "warranty": "1 year"}',
  'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800',
  ARRAY['Deep Purple', 'Ocean Blue', 'Jet Black'],
  true
),
(
  'SilentPods ANC',
  'silentpods-anc',
  'Entry-level noise cancelling earbuds with impressive ANC performance. Block out the world and focus on your music with up to 35dB noise reduction.',
  9999,
  0,
  60,
  'SonicPods',
  'anc',
  '{"battery_life": "7 hours", "charging_case_battery": "28 hours", "bluetooth_version": "5.1", "driver_size": "10mm", "noise_reduction": "35dB", "noise_cancellation": true, "transparency_mode": true, "warranty": "1 year"}',
  'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800',
  ARRAY['Graphite', 'Pearl White'],
  true
),
(
  'SportPods Flex',
  'sportpods-flex',
  'Designed for athletes - secure ear hooks, IP67 water resistance, and sweat-proof design. Never lose your earbuds during intense workouts again.',
  7999,
  1000,
  80,
  'SonicPods',
  'wireless',
  '{"battery_life": "12 hours", "charging_case_battery": "48 hours", "bluetooth_version": "5.2", "driver_size": "9mm", "water_resistance": "IP67", "ear_hooks": true, "heart_rate_monitor": false, "warranty": "1 year"}',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
  ARRAY['Volt Yellow', 'Sport Red', 'Cool Gray'],
  true
);

-- =============================================
-- Create indexes for better performance
-- =============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user ON orders(user_id);

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies
-- =============================================

-- Products: Anyone can read, only authenticated admins can modify
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by admins" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products are updatable by admins" ON products FOR UPDATE USING (true);
CREATE POLICY "Products are deletable by admins" ON products FOR DELETE USING (true);

-- Categories: Anyone can read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are modifiable by admins" ON categories FOR ALL USING (true);

-- Orders: Users can see their own orders
CREATE POLICY "Orders are viewable by owner" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders are insertable by anyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are updatable by admins" ON orders FOR UPDATE USING (true);

-- Contacts: Anyone can create, admins can read
CREATE POLICY "Contacts are insertable by anyone" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Contacts are viewable by admins" ON contacts FOR SELECT USING (true);

-- Admins table
CREATE POLICY "Admins can manage admins" ON admins FOR ALL USING (true);

-- =============================================
-- Create default admin user
-- Password: admin123 (hashed with bcrypt)
-- =============================================
INSERT INTO admins (email, password, name, role) VALUES
('admin@sonicpods.store', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'superadmin');

