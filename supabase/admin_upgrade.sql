-- 1. Add Location to Restaurants (for the Globe)
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS latitude DECIMAL(9,6);
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS longitude DECIMAL(9,6);

-- 2. Create Subscriptions Table (for "Active Subs" & Revenue)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL DEFAULT 'pro', -- 'starter', 'pro', 'enterprise'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing'
  price DECIMAL(10, 2) NOT NULL DEFAULT 49.00,
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can see all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: Owners can see their own subscription
CREATE POLICY "Owners can view own subscription" ON subscriptions
FOR SELECT USING (
  restaurant_id IN (SELECT restaurant_id FROM profiles WHERE id = auth.uid())
);

-- 3. Update the Admin Stats RPC to include Subscription data & Locations
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  total_restaurants INTEGER;
  total_clients INTEGER;
  total_revenue NUMERIC;
  active_subs_count INTEGER;
  total_subs_count INTEGER;
  active_subs_percentage INTEGER;
  pending_setup_count INTEGER;
  revenue_history JSON;
  map_locations JSON;
  is_admin BOOLEAN;
BEGIN
  -- Security Check
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') INTO is_admin;
  IF NOT is_admin THEN
     RETURN json_build_object('error', 'Access Denied');
  END IF;

  -- Basic Counts
  SELECT COUNT(*) INTO total_restaurants FROM restaurants;
  SELECT COUNT(*) INTO total_clients FROM profiles WHERE role = 'owner';

  -- Subscription Stats
  SELECT COUNT(*) INTO total_subs_count FROM subscriptions;
  SELECT COUNT(*) INTO active_subs_count FROM subscriptions WHERE status = 'active';
  
  IF total_subs_count > 0 THEN
    active_subs_percentage := (active_subs_count::decimal / total_subs_count::decimal) * 100;
  ELSE
    active_subs_percentage := 0;
  END IF;

  -- "Pending Setup": Restaurants that have 0 menu items
  SELECT COUNT(*) INTO pending_setup_count 
  FROM restaurants r
  WHERE NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.restaurant_id = r.id);

  -- Total Platform Revenue: (Orders Total + Subscriptions Revenue if we wanted, for now just Orders)
  SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue FROM orders WHERE status != 'cancelled';

  -- Revenue History (Last 7 Days)
  SELECT json_agg(t) INTO revenue_history FROM (
    SELECT 
      to_char(date_trunc('day', created_at), 'Mon DD') as name,
      COALESCE(SUM(total_amount), 0) as total
    FROM orders
    WHERE created_at > now() - INTERVAL '7 days' AND status != 'cancelled'
    GROUP BY 1
    ORDER BY MIN(created_at)
  ) t;

  -- Globe Locations
  SELECT json_agg(l) INTO map_locations FROM (
    SELECT latitude, longitude, name FROM restaurants
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    LIMIT 100
  ) l;

  RETURN json_build_object(
    'total_restaurants', total_restaurants,
    'total_clients', total_clients,
    'total_revenue', total_revenue,
    'active_subs_percentage', active_subs_percentage,
    'pending_setup_count', pending_setup_count,
    'revenue_history', COALESCE(revenue_history, '[]'::json),
    'map_locations', COALESCE(map_locations, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
