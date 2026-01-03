-- Migration script to add 'half' column to existing products table
-- Run this ONLY if you already have a products table without the 'half' column

-- Add the half column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'half') THEN
        ALTER TABLE products ADD COLUMN half INTEGER NOT NULL DEFAULT 1 CHECK (half IN (1, 2));
    END IF;
END $$;

-- Update existing products to distribute them between halves
-- This will assign products alternately to half 1 and half 2
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM products
)
UPDATE products 
SET half = CASE 
  WHEN (SELECT row_num FROM numbered_products WHERE numbered_products.id = products.id) % 2 = 1 THEN 1 
  ELSE 2 
END
WHERE half = 1; -- Only update products that still have the default value

-- Create index for the half column if it doesn't exist
CREATE INDEX IF NOT EXISTS products_half_idx ON products(half);

-- Verify the distribution
SELECT 
  half,
  COUNT(*) as product_count
FROM products 
GROUP BY half
ORDER BY half;