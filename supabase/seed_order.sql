
-- 1. Create a Table
INSERT INTO tables (restaurant_id, number, capacity, status)
SELECT 
  get_my_restaurant_id(),
  '12',
  4,
  'occupied'
WHERE NOT EXISTS (SELECT 1 FROM tables WHERE number = '12' AND restaurant_id = get_my_restaurant_id());

-- 2. Create a Menu Item
INSERT INTO menu_items (restaurant_id, name, description, price, category_id)
SELECT 
  get_my_restaurant_id(),
  'Truffle Burger',
  'Wagyu beef with truffle mayo',
  25.00,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Truffle Burger' AND restaurant_id = get_my_restaurant_id());

-- 3. Create an Order
WITH my_table AS (
  SELECT id FROM tables WHERE number = '12' AND restaurant_id = get_my_restaurant_id() LIMIT 1
),
my_item AS (
  SELECT id FROM menu_items WHERE name = 'Truffle Burger' AND restaurant_id = get_my_restaurant_id() LIMIT 1
),
new_order AS (
  INSERT INTO orders (restaurant_id, table_id, status, total_amount)
  SELECT get_my_restaurant_id(), id, 'pending', 50.00 FROM my_table
  RETURNING id
)
INSERT INTO order_items (restaurant_id, order_id, menu_item_id, quantity, price_at_time, notes)
SELECT 
  get_my_restaurant_id(), 
  new_order.id, 
  (SELECT id FROM my_item), 
  2, 
  25.00, 
  'No onions please'
FROM new_order;
