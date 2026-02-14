-- CRITICAL: Enables Realtime subscriptions for the orders table
-- Without this, the dashboard will NOT update automatically

-- 1. Enable replication on the table (required for listening to changes)
ALTER TABLE "public"."orders" REPLICA IDENTITY FULL;

-- 2. Add the table to the realtime publication
-- This explicitly tells Supabase to broadcast INSERT/UPDATE/DELETE events for this table
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table "public"."orders", "public"."order_items";
commit;

-- OR if you want to be safer and just append (if publication exists):
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;
-- But the above recreation ensures it's clean and includes what we need.
