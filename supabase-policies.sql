-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to all products
CREATE POLICY "Allow public read access"
ON products
FOR SELECT
TO anon
USING (true);

-- Create policy to allow authenticated users to update stock (for later admin functionality)
CREATE POLICY "Allow authenticated users to update stock"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to insert products (for later admin functionality)
CREATE POLICY "Allow authenticated users to insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to delete products (for later admin functionality)
CREATE POLICY "Allow authenticated users to delete products"
ON products
FOR DELETE
TO authenticated
USING (true); 