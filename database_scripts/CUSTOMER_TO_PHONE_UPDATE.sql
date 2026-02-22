-- Rename and migrate from customer_name to customer_phone
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Migrate any strictly numeric customer_name entries into customer_phone where it's currently null.
UPDATE orders 
SET customer_phone = customer_name 
WHERE customer_phone IS NULL 
  AND customer_name ~ '^[0-9\+\-\s\(\)]+$';
