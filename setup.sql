-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
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
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_created_at_idx ON products(created_at DESC);

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

-- Create subscribers table if it doesn't exist
create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table subscribers enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Enable insert for all users" on subscribers;
drop policy if exists "Enable select for authenticated users only" on subscribers;

-- Create a simple insert policy that allows anyone to subscribe
create policy "Anyone can subscribe" on subscribers for
    insert with check (true);

-- Create a policy that allows only authenticated users to view subscribers
create policy "Only authenticated users can view subscribers" on subscribers for
    select using (auth.role() = 'authenticated');

-- Create policy to allow inserts
create policy "Enable insert for all users" on public.subscribers
  for insert with check (true);

-- Create policy to allow select for authenticated users only
create policy "Enable select for authenticated users only" on public.subscribers
  for select using (auth.role() = 'authenticated'); 