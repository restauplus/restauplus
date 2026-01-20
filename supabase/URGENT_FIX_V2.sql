-- ==============================================================================
-- 🚨 URGENT FIX: RUN THIS SCRIPT IN SUPABASE SQL EDITOR 🚨
-- Link: https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. TEMPORARILY REMOVE THE TRIGGER (stops the "Database error" immediately)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- 2. ADD MISSING COLUMNS (The root cause of the error)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 3. FIX DATA INTEGRITY
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS valid_status;

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_status 
CHECK (status IN ('active', 'pending', 'rejected', 'banned'));

-- 4. RESTORE THE ONBOARDING TRIGGER (With Safe Code)
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Member'),
    -- Safely cast role, default to 'owner' if missing
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'owner'::public.user_role),
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email; -- Just ensure email is synced
    
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- IF anything fails here, we swallow the error so the USER CREATION doesn't fail.
  -- This is a safety net. The profile might be missing, but the user account works.
  -- The RPC 'handle_new_owner_signup' will fix the profile anyway.
  RAISE WARNING 'Profile creation failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 5. ENSURE THE SIGNUP RPC FUNCTION EXISTS (Used by the Register Page)
CREATE OR REPLACE FUNCTION handle_new_owner_signup(
  restaurant_name TEXT,
  restaurant_slug TEXT,
  owner_full_name TEXT
) RETURNS VOID AS $$
DECLARE
  new_restaurant_id UUID;
BEGIN
  -- Create Restaurant
  INSERT INTO restaurants (name, slug) 
  VALUES (restaurant_name, restaurant_slug) 
  RETURNING id INTO new_restaurant_id;

  -- Update the Profile with the new restaurant
  UPDATE public.profiles
  SET 
    restaurant_id = new_restaurant_id,
    full_name = owner_full_name,
    role = 'owner',
    status = 'pending'
  WHERE id = auth.uid();
  
  -- Fallback: If profile doesn't exist (e.g. trigger failed silently), create it now
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, full_name, restaurant_id, role, status)
    VALUES (
      auth.uid(), 
      (SELECT email FROM auth.users WHERE id = auth.uid()), 
      owner_full_name, 
      new_restaurant_id, 
      'owner',
      'pending'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. GRANT PERMISSIONS
GRANT EXECUTE ON FUNCTION handle_new_owner_signup(TEXT, TEXT, TEXT) TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
