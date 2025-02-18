-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if you want to recreate them
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL, -- Price in cents
    stock INTEGER, -- NULL means infinite stock
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('jewelry', 'packaging')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);

-- Insert sample jewelry products
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
(
    'Silver Chain Necklace',
    'Handcrafted sterling silver chain with a minimalist design. Each piece is unique and carefully created.',
    29900, -- $299.00
    5,
    'https://images.unsplash.com/photo-1611085583191-a3b181a88401',
    'jewelry'
),
(
    'Gold Ring Set',
    'Set of three stackable 14k gold rings. Modern, versatile, and perfect for everyday wear.',
    49900, -- $499.00
    3,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
    'jewelry'
),
(
    'Black Diamond Pendant',
    'Elegant black diamond pendant on an 18k white gold chain. A statement piece that commands attention.',
    89900, -- $899.00
    2,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    'jewelry'
);

-- Insert sample packaging products
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
(
    'Minimal Black Box',
    'Premium black cardboard box with magnetic closure. Perfect for jewelry and small items.',
    1500, -- $15.00
    NULL, -- Infinite stock
    'https://images.unsplash.com/photo-1544816155-12df9643f363',
    'packaging'
),
(
    'Velvet Pouch Set',
    'Set of 5 black velvet pouches with silver drawstring. Elegant and protective.',
    2500, -- $25.00
    NULL, -- Infinite stock
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    'packaging'
),
(
    'Premium Gift Wrap Kit',
    'Complete gift wrapping kit including black paper, ribbon, and custom stickers.',
    3500, -- $35.00
    NULL, -- Infinite stock
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a',
    'packaging'
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS cart_items_session_id_idx ON cart_items(session_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable insert for all users" ON subscribers;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
DROP POLICY IF EXISTS "Only authenticated users can view subscribers" ON subscribers;
DROP POLICY IF EXISTS "Anyone can manage their own cart items" ON cart_items;

-- Create policies
CREATE POLICY "Enable insert for everyone" ON subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can manage their own cart items" ON cart_items
  FOR ALL
  USING (true);

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT
  USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON subscribers TO anon;
GRANT ALL ON cart_items TO anon;
GRANT SELECT ON products TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Create function to check stock before purchase
CREATE OR REPLACE FUNCTION check_product_stock(product_id UUID, quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT stock INTO current_stock
    FROM products
    WHERE id = product_id;

    -- If stock is NULL (infinite) or greater than quantity, return true
    RETURN current_stock IS NULL OR current_stock >= quantity;
END;
$$ LANGUAGE plpgsql; 