-- 1. Ironclad Admin Check (JWT Based to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  -- Check JWT metadata or direct email list
  RETURN (
    (auth.jwt() ->> 'email') IN ('admin@restauplus.com', 'admin212123@restauplus.com')
    OR EXISTS (
      -- Fallback to bypass RLS check for the profile table itself using a subquery that doesn't trigger RLS
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND (raw_user_meta_data->>'role' = 'admin')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Global Profile Policies for Admins
DROP POLICY IF EXISTS "Admins see all, members see team" ON public.profiles;
CREATE POLICY "Admins see all, members see team" ON public.profiles
  FOR SELECT TO authenticated 
  USING ( is_admin() OR restaurant_id = (SELECT p.restaurant_id FROM public.profiles p WHERE p.id = auth.uid()) OR id = auth.uid() );

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING ( is_admin() );

-- 2. Anti-Privilege Escalation Trigger
-- This prevents ANY user from updating their own ROLE or STATUS via the API
CREATE OR REPLACE FUNCTION public.protect_user_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- If not an admin, block changes to role and status
  IF NOT public.is_admin() THEN
    NEW.role = OLD.role;
    NEW.status = OLD.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_update_protect ON public.profiles;
CREATE TRIGGER on_profile_update_protect
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_fields();

-- 3. Strict Profile Update Policy
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;
CREATE POLICY "Update own profile" ON public.profiles 
  FOR UPDATE TO authenticated 
  USING ( auth.uid() = id OR is_admin() )
  WITH CHECK ( auth.uid() = id OR is_admin() );

DROP POLICY IF EXISTS "Admins can update any restaurant" ON public.restaurants;
CREATE POLICY "Admins can update any restaurant" ON public.restaurants FOR UPDATE TO authenticated USING ( is_admin() );

-- 5. Fix Column Existence (Safe Check)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'is_active') THEN
        ALTER TABLE public.restaurants ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;
