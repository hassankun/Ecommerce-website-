-- =============================================
-- SonicPods Complete Schema with Full SEO Support
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing tables
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
  ('ANC', 'anc', 'Active Noise Cancellation earbuds for immersive sound');

-- =============================================
-- Products Table with Full SEO Support
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Product Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  stock INTEGER DEFAULT 0,
  brand TEXT DEFAULT 'SonicPods',
  category_id UUID REFERENCES categories(id),
  type TEXT NOT NULL DEFAULT 'wireless' CHECK (type IN ('wireless', 'gaming', 'anc')),
  
  -- Product Details
  features JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  image TEXT,
  colors TEXT[] DEFAULT ARRAY['Black']::TEXT[],
  in_stock BOOLEAN DEFAULT true,
  
  -- Meta Tags (SEO)
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- OpenGraph Tags (Social Sharing)
  og_title TEXT,
  og_description TEXT,
  og_type TEXT DEFAULT 'product',
  og_image TEXT,
  
  -- Twitter Card
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  
  -- SEO Content
  seo_title TEXT,
  seo_description TEXT,
  
  -- Schema.org Structured Data
  schema_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Orders Table
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
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
-- Order Items Table
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
-- Contacts Table
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
-- Create Indexes for Performance
-- =============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);

-- =============================================
-- Enable Row Level Security
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies (Allow All for Development)
-- =============================================
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admins" ON admins FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Create Admin User
-- Email: admin@sonicpods.store
-- Password: admin123
-- =============================================
INSERT INTO admins (email, password, name, role) VALUES
('admin@sonicpods.store', '$2b$10$yIC3/qty/VgA211h2QPizOg55cUbBhJWW21Swq21k8A/o.7sEqepm', 'Admin', 'superadmin');

-- =============================================
-- Success Message
-- =============================================
-- ✅ Schema created successfully!
-- ✅ Admin user created: admin@sonicpods.store / admin123
-- ✅ SEO fields included: meta_title, meta_description, og_*, twitter_*, schema_description
-- 
-- Now go to http://localhost:3000/admin/login
-- Products added via admin will have AI-generated SEO content!

