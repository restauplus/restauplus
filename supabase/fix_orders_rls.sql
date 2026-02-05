-- Enable RLS on orders and order_items if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users (public) to insert orders
CREATE POLICY "Allow public insert orders" ON orders
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Allow anonymous users (public) to read their own orders (optional, but good for confirmation if we were redirecting)
-- For now, just insert is critical.
-- We might also need to allow them to select the order immediately after inserting it to get the ID, 
-- but 'select().single()' in supabase client usually requires SELECT permission.

CREATE POLICY "Allow public select orders" ON orders
FOR SELECT TO anon, authenticated
USING (true); -- In a real app, strict this to session/cookie ID, but for this demo/public menu, allow reading (or at least the one just created)

-- Allow anonymous users to insert order items
CREATE POLICY "Allow public insert order_items" ON order_items
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public select order_items" ON order_items
FOR SELECT TO anon, authenticated
USING (true);
