-- ==============================================================================
-- ADD PLAN TYPE COLUMN TO PROFILES
-- ==============================================================================
-- This simple script adds a `plan_type` column to the `profiles` table so that
-- your Admin Dashboard can securely read the exact subscription plan the user 
-- selected during sign-up.

BEGIN;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_type TEXT;

COMMIT;

-- ✅ SUCCESS: You can now see the selected plans in the Admin Dashboard!
