-- Secure Function to update User Email & Password from Admin Dashboard
-- Requires 'pgcrypto' for password hashing.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP FUNCTION IF EXISTS admin_update_user_secret(UUID, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION admin_update_user_secret(
    target_user_id UUID,
    new_full_name TEXT,
    new_email TEXT,
    new_password TEXT,
    new_role TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres/superuser)
AS $$
BEGIN
    -- 1. Update Public Profile
    UPDATE public.profiles
    SET 
        full_name = new_full_name,
        email = new_email,
        plain_password = new_password, -- Keep reference
        role = new_role::user_role -- Cast to enum if applicable, or TEXT if not
    WHERE id = target_user_id;

    -- 2. Update Auth User (Email & Password)
    -- WARNING: Direct update to auth.users. 
    -- This handles the login credentials.
    UPDATE auth.users
    SET 
        email = new_email,
        encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = now()
    WHERE id = target_user_id;

    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error updating user: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant Access to Authenticated Users (Application Level Security will handle the check in Server Action)
GRANT EXECUTE ON FUNCTION admin_update_user_secret TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_secret TO service_role;
