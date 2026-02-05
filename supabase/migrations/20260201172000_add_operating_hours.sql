-- Add operating hours and order status to restaurants table
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS opening_time TIME DEFAULT '09:00:00',
ADD COLUMN IF NOT EXISTS closing_time TIME DEFAULT '22:00:00',
ADD COLUMN IF NOT EXISTS is_taking_orders BOOLEAN DEFAULT TRUE;
