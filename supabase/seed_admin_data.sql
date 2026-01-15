-- 1. Add coordinates to existing restaurants
UPDATE restaurants 
SET latitude = 25.2048, longitude = 55.2708 
WHERE latitude IS NULL AND slug LIKE '%bader%'; -- Assume your test restaurant is in Dubai

UPDATE restaurants 
SET latitude = 40.7128, longitude = -74.0060 
WHERE latitude IS NULL AND slug = 'burger-co'; -- Example NY

-- 2. Add a dummy subscription
INSERT INTO subscriptions (restaurant_id, plan_name, status, price)
SELECT id, 'pro', 'active', 99.00
FROM restaurants
LIMIT 1;
