-- 1. Ensure the 'phone' column exists (using the name from your screenshot)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Drop old functions to avoid conflicts
DROP FUNCTION IF EXISTS handle_new_owner_signup(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS handle_new_owner_signup(TEXT, TEXT, TEXT); 

-- 3. Recreate the function using 'phone' instead of 'phone_number'
CREATE OR REPLACE FUNCTION handle_new_owner_signup(
  restaurant_name TEXT,
  restaurant_slug TEXT,
  owner_full_name TEXT,
  owner_phone TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  new_restaurant_id UUID;
BEGIN
  -- 1. Create Restaurant
  INSERT INTO restaurants (name, slug) 
  VALUES (restaurant_name, restaurant_slug) 
  RETURNING id INTO new_restaurant_id;

  -- 2. Create or Update Profile for the current auth user
  INSERT INTO public.profiles (id, email, full_name, restaurant_id, role, status, phone)
  VALUES (
    auth.uid(), 
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    owner_full_name, 
    new_restaurant_id, 
    'owner',
    'pending',
    owner_phone
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    restaurant_id = EXCLUDED.restaurant_id,
    phone = EXCLUDED.phone,
    role = 'owner';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
