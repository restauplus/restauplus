-- ==============================================================================
-- 🚀 FIX ACCESS CONTROL SAVE ERRORS 🚀
-- ==============================================================================
-- This script fixes the issues preventing you from saving in Access Control.
-- It ensures the platform_settings table exists and correctly sets its RLS policies.
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Copy ALL the code below.
-- 2. Go to your Supabase Dashboard -> SQL Editor (left sidebar).
-- 3. Paste the code and click "RUN".
-- ==============================================================================

BEGIN;

-- 1. Create table if missing
CREATE TABLE IF NOT EXISTS platform_settings (
    id INT PRIMARY KEY DEFAULT 1,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    allow_registrations BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ensure Row Exists
INSERT INTO platform_settings (id, maintenance_mode, allow_registrations) 
VALUES (1, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- 4. PUBLIC READ ACCESS (So the homepage knows if registrations are open)
DROP POLICY IF EXISTS "Public read access for platform settings" ON platform_settings;
CREATE POLICY "Public read access for platform settings" 
ON platform_settings 
FOR SELECT 
TO public 
USING (true);

-- 5. ALLOW ADMINS/OWNERS TO UPDATE THE SETTINGS (From the dashboard)
DROP POLICY IF EXISTS "Allow authenticated updates to platform settings" ON platform_settings;
CREATE POLICY "Allow authenticated updates to platform settings" 
ON platform_settings 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. ALLOW ADMINS TO UPSERT (Insert if needed by Supabase's upsert function)
DROP POLICY IF EXISTS "Allow authenticated inserts to platform settings" ON platform_settings;
CREATE POLICY "Allow authenticated inserts to platform settings" 
ON platform_settings 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

COMMIT;

-- ✅ ALL DONE. You can return to the dashboard and try clicking "Save Security Settings" again.
