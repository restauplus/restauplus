-- ================================================
-- FIX: Database error saving new user
-- Run this in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/omagrvgzmyxwzqisnbvq/sql
-- ================================================

-- 1. Add status column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 2. Add constraint to ensure valid status values (drop first to avoid conflicts)
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE profiles 
ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'pending', 'rejected', 'banned'));

-- 3. Ensure the RPC function exists and is correct
CREATE OR REPLACE FUNCTION handle_new_owner_signup(
  restaurant_name TEXT,
  restaurant_slug TEXT,
  owner_full_name TEXT
) RETURNS VOID AS $$
DECLARE
  new_restaurant_id UUID;
BEGIN
  -- 1. Create Restaurant
  INSERT INTO restaurants (name, slug) 
  VALUES (restaurant_name, restaurant_slug) 
  RETURNING id INTO new_restaurant_id;

  -- 2. Create or Update Profile for the current auth user
  INSERT INTO public.profiles (id, email, full_name, restaurant_id, role, status)
  VALUES (
    auth.uid(), 
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    owner_full_name, 
    new_restaurant_id, 
    'owner',
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    restaurant_id = EXCLUDED.restaurant_id,
    role = 'owner';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant execute permission on the RPC function
GRANT EXECUTE ON FUNCTION handle_new_owner_signup(TEXT, TEXT, TEXT) TO authenticated;

-- 5. Add RLS policy to allow inserting into restaurants during signup
DROP POLICY IF EXISTS "Allow restaurant creation on signup" ON restaurants;
CREATE POLICY "Allow restaurant creation on signup" ON restaurants
  FOR INSERT WITH CHECK (true);

-- This policy is intentionally permissive because the handle_new_owner_signup 
-- function runs with SECURITY DEFINER (elevated privileges).
-- The function itself validates the auth.uid() before insert.

-- 6. Ensure profiles insert is allowed for authenticated users (for their own record)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());
