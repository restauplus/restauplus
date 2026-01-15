-- Secure Function to get Admin Stats (Bypasses RLS)
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  total_restaurants INTEGER;
  total_clients INTEGER;
  total_revenue NUMERIC;
  revenue_history JSON;
  is_admin BOOLEAN;
BEGIN
  -- 1. Security Check
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO is_admin;

  -- Allow if admin, otherwise return zeros (instead of erroring) to prevent UI crash
  IF NOT is_admin THEN
     RETURN json_build_object(
        'total_restaurants', 0,
        'total_clients', 0,
        'total_revenue', 0,
        'revenue_history', '[]'::json,
        'error', 'Access Denied'
     );
  END IF;

  -- 2. Count Restaurants
  SELECT COUNT(*) INTO total_restaurants FROM restaurants;

  -- 3. Count Clients (Owners)
  SELECT COUNT(*) INTO total_clients FROM profiles WHERE role = 'owner';

  -- 4. Calculate Total Revenue
  SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue 
  FROM orders 
  WHERE status != 'cancelled';

  -- 5. Calculate Revenue History (Last 7 Days)
  SELECT json_agg(t) INTO revenue_history FROM (
    SELECT 
      to_char(date_trunc('day', created_at), 'Mon DD') as name,
      COALESCE(SUM(total_amount), 0) as total
    FROM orders
    WHERE created_at > now() - INTERVAL '7 days'
      AND status != 'cancelled'
    GROUP BY 1
    ORDER BY MIN(created_at)
  ) t;

  -- Return JSON
  RETURN json_build_object(
    'total_restaurants', total_restaurants,
    'total_clients', total_clients,
    'total_revenue', total_revenue,
    'revenue_history', COALESCE(revenue_history, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
