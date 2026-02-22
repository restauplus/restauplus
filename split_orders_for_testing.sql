-- OPTIONAL: Run this to test "Daily Orders" vs "Total Orders"
-- This moves half of your orders to "Yesterday" so you see different numbers.

UPDATE orders
SET created_at = NOW() - INTERVAL '25 hours', -- Move to yesterday
    updated_at = NOW() - INTERVAL '25 hours'
WHERE id IN (
  SELECT id FROM orders 
  ORDER BY created_at DESC 
  LIMIT (SELECT COUNT(*) / 2 FROM orders)
);
