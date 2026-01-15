-- 1. Add 'admin' to the role enum (if not exists)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- 2. Update RLS to allow Admins to do EVERYTHING
-- Note: We use a technique to avoid infinite recursion on the profiles table.

-- Helper function to check if user is admin (security definer = runs as superuser, bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- Restaurants: Admin can view all
CREATE POLICY "Admins can view all restaurants" ON restaurants
FOR ALL USING (
  is_admin()
);

-- Profiles: Admin can view all
CREATE POLICY "Admins can view all profiles" ON profiles
FOR ALL USING (
  is_admin()
);

-- Orders: Admin can view all
CREATE POLICY "Admins can view all orders" ON orders
FOR ALL USING (
  is_admin()
);

-- Grant Admin role to your specific email (REPLACE WITH YOUR EMAIL in the query editor)
-- UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL';
