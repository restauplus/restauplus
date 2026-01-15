-- FIX ADMIN VISIBILITY ISSUES
-- This script explicitly grants admins access to EVERYTHING.

-- 1. Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all restaurants" ON restaurants;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

-- 2. Update the helper function to be extra safe (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER; 
-- SECURITY DEFINER is crucial: it runs as superuser, ignoring RLS on the profiles table itself while checking role.

-- 3. Re-apply Broad Admin Policies

-- PROFILES (Crucial for Client List)
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  is_admin()
);

-- RESTAURANTS
CREATE POLICY "Admins can view all restaurants" ON restaurants
FOR SELECT USING (
  is_admin()
);

-- ORDERS (For Revenue)
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT USING (
  is_admin()
);

-- 4. Verify Admin Role (Just in case)
-- RUN THIS INDIVIDUALLY IF NEEDED:
-- UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
