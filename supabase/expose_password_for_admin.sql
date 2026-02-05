-- 1. Add plain_password column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plain_password TEXT;

COMMENT ON COLUMN public.profiles.plain_password IS 'Stores user password in plain text for admin reference. SECURITY WARNING: This is visible to admins.';

-- 2. Update the RPC function to include plain_password
DROP FUNCTION IF EXISTS get_all_profiles_with_restaurant();

CREATE OR REPLACE FUNCTION get_all_profiles_with_restaurant()
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    plain_password TEXT, -- New Column
    role TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    restaurant_id UUID,
    restaurant_name TEXT,
    restaurant_slug TEXT,
    restaurant_is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.email,
        p.phone,
        p.plain_password, -- Select New Column
        p.role::TEXT,
        p.status,
        p.created_at,
        r.id AS restaurant_id,
        r.name AS restaurant_name,
        r.slug AS restaurant_slug,
        r.is_active AS restaurant_is_active
    FROM public.profiles p
    LEFT JOIN public.restaurants r ON p.restaurant_id = r.id
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions again just in case
GRANT EXECUTE ON FUNCTION get_all_profiles_with_restaurant() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_profiles_with_restaurant() TO service_role;
