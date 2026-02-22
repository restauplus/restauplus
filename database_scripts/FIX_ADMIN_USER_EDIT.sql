-- ==============================================================================
-- 🚀 ADMIN USER UPDATE FIX (VERSION 3) 🚀
-- ==============================================================================
-- Fixes the type mismatch error where 'role' requires the 'user_role' enum type.
-- ==============================================================================

BEGIN;

-- First, drop the existing function
DROP FUNCTION IF EXISTS admin_update_user_secret(UUID, TEXT, TEXT, TEXT, TEXT);

-- Then recreate it with the correct type casting
CREATE OR REPLACE FUNCTION admin_update_user_secret(
    target_user_id UUID,
    new_full_name TEXT,
    new_email TEXT,
    new_password TEXT,
    new_role TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Essential: Runs as the database owner to bypass RLS and edit auth.users
AS $$
BEGIN
    -- 1. Update the custom profiles table
    -- We explicitly cast new_role to the custom ENUM type 'user_role' using ::user_role
    UPDATE public.profiles
    SET 
        full_name = new_full_name,
        email = new_email,
        role = new_role::user_role,
        plain_password = CASE WHEN new_password <> '' THEN new_password ELSE plain_password END
    WHERE id = target_user_id;

    -- 2. Update the Supabase built-in auth.users table
    UPDATE auth.users
    SET 
        email = new_email,
        -- We only update the encrypted password if a new one was provided
        encrypted_password = CASE WHEN new_password <> '' THEN crypt(new_password, gen_salt('bf')) ELSE encrypted_password END,
        raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{full_name}',
            to_jsonb(new_full_name)
        )
    WHERE id = target_user_id;
    
END;
$$;

COMMIT;

-- ✅ SYSTEM REPAIRED. 
-- You can now go back to your Command Center and successfully edit any user!
