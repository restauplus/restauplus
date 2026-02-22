-- ==============================================================================
-- 🚀 ADD SALES ROLE FIX 🚀
-- ==============================================================================
-- This script safely adds the 'sales' option to your allowed user_roles
-- ==============================================================================

BEGIN;

-- PostgreSQL has a strict rule: you cannot add an ENUM value inside a transaction block 
-- if the enum was created in a previous transaction. However, we can just execute the ALTER 
-- statement using a safe DO block if needed.

COMMIT;

-- This command cannot be run inside a BEGIN/COMMIT block, so it executes directly.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'sales';

-- ==============================================================================
-- ✅ ROLE ADDED.
-- You can now go to Edit User in your Admin Dashboard and select Sales!
-- ==============================================================================
