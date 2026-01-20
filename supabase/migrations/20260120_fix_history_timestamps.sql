-- FIX ORDER HISTORY TIMESTAMPS
-- This script adds the missing columns and creates a trigger to AUTOMATICALLY populate them
-- whenever the status changes. This ensures data integrity even if the frontend fails.

-- 1. Ensure Columns Exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS preparing_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ready_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS served_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- 2. Create Trigger Function to Auto-Set Timestamps
CREATE OR REPLACE FUNCTION public.handle_order_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to 'preparing', set preparing_at
  IF NEW.status = 'preparing' AND (OLD.status IS DISTINCT FROM 'preparing') THEN
    NEW.preparing_at = NOW();
  END IF;

  -- If status changed to 'ready', set ready_at
  IF NEW.status = 'ready' AND (OLD.status IS DISTINCT FROM 'ready') THEN
    NEW.ready_at = NOW();
  END IF;

  -- If status changed to 'served', set served_at
  IF NEW.status = 'served' AND (OLD.status IS DISTINCT FROM 'served') THEN
    NEW.served_at = NOW();
  END IF;

  -- If status changed to 'paid', set paid_at
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    NEW.paid_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach Trigger to Orders Table
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_status_update();

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
