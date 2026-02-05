-- 1. Reload PostgREST schema cache (Crucial for new columns to appear in API)
NOTIFY pgrst, 'reload config';

-- 2. Grant permissions explicitly to ensure no permission issues
GRANT SELECT, UPDATE, INSERT ON public.profiles TO authenticated;
GRANT SELECT, UPDATE, INSERT ON public.profiles TO service_role;

-- 3. Verify column again (just to be safe)
COMMENT ON COLUMN public.profiles.phone IS 'User phone number';
