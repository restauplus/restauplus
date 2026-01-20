-- FIX: Ensure Order Timestamp Columns Exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS preparing_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS served_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- FIX: Ensure Permissions for Updating Orders
-- We drop the restrict policy just in case, and utilize a broad Owner policy
DROP POLICY IF EXISTS "Owners can update orders" ON orders;

CREATE POLICY "Owners can update orders" ON orders
FOR UPDATE USING (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.restaurant_id = orders.restaurant_id
    and (profiles.role = 'owner' OR profiles.role = 'manager')
  )
)
WITH CHECK (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.restaurant_id = orders.restaurant_id
    and (profiles.role = 'owner' OR profiles.role = 'manager')
  )
);
