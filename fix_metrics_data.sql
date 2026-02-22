-- 1. FIX DATA FOR TESTING
-- This updates your old orders from February 14th to "Today" so you can see the counters work.
-- It keeps the order details but changes the date to NOW().

UPDATE orders
SET created_at = NOW(),
    updated_at = NOW()
WHERE created_at < NOW() - INTERVAL '1 day' -- Selects old orders
  AND status != 'cancelled';                 -- Skips cancelled ones

-- 2. (Optional) Insert a FRESH test order for today to verify "+1"
-- Note: You normally don't need this if you ran the update above.
-- But if you have NO data, run this:

/*
INSERT INTO orders (
  restaurant_id, 
  status, 
  total_amount, 
  order_type, 
  customer_name, 
  table_number,
  created_at
)
SELECT 
  id as restaurant_id,
  'served',
  50.00,
  'dine_in',
  'Test Customer Today',
  '99',
  NOW()
FROM restaurants
LIMIT 1;
*/
