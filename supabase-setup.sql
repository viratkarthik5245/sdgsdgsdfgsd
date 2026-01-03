-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  usage_instructions TEXT NOT NULL,
  external_link VARCHAR(500) NOT NULL,
  half INTEGER NOT NULL DEFAULT 1 CHECK (half IN (1, 2)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public product catalog)
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON products
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_name_idx ON products(name);
CREATE INDEX IF NOT EXISTS products_half_idx ON products(half);

-- Insert some sample data (optional)
INSERT INTO products (name, description, usage_instructions, external_link, half) VALUES
('Sample Product 1', 'This is a sample product to demonstrate the system', 'This is how you use this sample product', 'https://example.com', 1),
('Sample Product 2', 'Another sample product for testing', 'Instructions for the second sample product', 'https://example.com', 2)
ON CONFLICT (id) DO NOTHING;