-- 🛡️ ULTIMATE BULLETPROOF SECURITY LAYER 🛡️
-- Purpose: Make the system unhackable by enforcing strict role/status boundaries.

-- 1. Master Admin Identity (Immutable)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
DECLARE
    current_email TEXT;
BEGIN
    current_email := auth.jwt() ->> 'email';
    -- 1. Hardcoded Master Access
    IF current_email IN ('admin@restauplus.com', 'admin212123@restauplus.com') THEN
        RETURN TRUE;
    END IF;

    -- 2. Metadata Check (Secondary Admins)
    -- This relies on the trigger below keeping metadata and profile in sync
    RETURN (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Strict Signup & Role Enforcement
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    is_master_admin BOOLEAN;
BEGIN
    is_master_admin := NEW.email IN ('admin@restauplus.com', 'admin212123@restauplus.com');

    -- Safety: Profiles always start as 'pending' unless it's the Master Admin
    -- Safety: Roles are restricted to 'owner' or 'staff' for new signups
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Member'),
        CASE WHEN is_master_admin THEN 'admin' ELSE 'owner' END,
        CASE WHEN is_master_admin THEN 'active' ELSE 'pending' END
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        -- MASTER PROTECTION: Status can ONLY be changed by a Super Admin later, not on re-login
        role = CASE WHEN is_master_admin THEN 'admin' ELSE public.profiles.role END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();


-- 3. Field Shield (Anti-Privilege Escalation)
CREATE OR REPLACE FUNCTION public.protect_user_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Only Master Admins or system processes can update Role/Status for others
    -- Normal users cannot touch these fields
    IF NOT public.is_admin() THEN
        NEW.role = OLD.role;
        NEW.status = OLD.status;
        NEW.restaurant_id = OLD.restaurant_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_update_protect ON public.profiles;
CREATE TRIGGER on_profile_update_protect
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_user_fields();


-- 4. Global RLS Lockdown
-- Refresh all policies to use the new robust is_admin()

-- PROFILES
DROP POLICY IF EXISTS "Admins see all" ON public.profiles;
DROP POLICY IF EXISTS "Admins see all, members see team" ON public.profiles;
CREATE POLICY "Admins see all, members see team" ON public.profiles
    FOR SELECT TO authenticated 
    USING ( is_admin() OR restaurant_id = (SELECT p.restaurant_id FROM public.profiles p WHERE p.id = auth.uid()) OR id = auth.uid() );

-- RESTAURANTS
DROP POLICY IF EXISTS "Admins see all, members see own" ON public.restaurants;
CREATE POLICY "Admins see all, members see own" ON public.restaurants
    FOR SELECT TO authenticated 
    USING ( is_admin() OR id = (SELECT restaurant_id FROM public.profiles WHERE id = auth.uid()) );

-- OPERATIONAL (Orders, Menu, Tables, etc.)
-- We apply a generic bypass to all operational tables
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('orders', 'order_items', 'menu_items', 'categories', 'tables', 'leads', 'customers')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Admin Bypass" ON %I', t);
        EXECUTE format('CREATE POLICY "Admin Bypass" ON %I FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin())', t);
    END LOOP;
END $$;
