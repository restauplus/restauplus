-- FORCE ADD MISSING COLUMNS
-- This script explicitly adds the missing timestamp columns to the orders table.
-- It uses IF NOT EXISTS to be safe to run multiple times.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS preparing_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS served_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Force schema cache reload (by notifying PostgREST if possible, or just by altering the table which usually triggers it)
NOTIFY pgrst, 'reload schema';
