-- 1. Add phone_number column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 2. Update the handle_new_owner_signup function to accept phone number
CREATE OR REPLACE FUNCTION handle_new_owner_signup(
  restaurant_name TEXT,
  restaurant_slug TEXT,
  owner_full_name TEXT,
  owner_phone TEXT DEFAULT NULL -- Default to NULL for backward compatibility
) RETURNS VOID AS $$
DECLARE
  new_restaurant_id UUID;
BEGIN
  -- 1. Create Restaurant
  INSERT INTO restaurants (name, slug) 
  VALUES (restaurant_name, restaurant_slug) 
  RETURNING id INTO new_restaurant_id;

  -- 2. Create or Update Profile for the current auth user
  INSERT INTO public.profiles (id, email, full_name, restaurant_id, role, status, phone_number)
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
    phone_number = EXCLUDED.phone_number,
    role = 'owner';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
