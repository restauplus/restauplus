-- Create Analytics Table for Visitors and QR Scans
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'qr_scan', 'add_to_cart', 'checkout_start'
  metadata JSONB DEFAULT '{}'::JSONB, -- Can store user_agent, referrer, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 1. Insert Policy: Allow Anyone (Public) to insert analytics (e.g. page views)
CREATE POLICY "Public can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- 2. Select Policy: Only Owners/Managers can view their restaurant's analytics
CREATE POLICY "Owners view own analytics" ON analytics
  FOR SELECT USING (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.restaurant_id = analytics.restaurant_id
      and (profiles.role = 'owner' OR profiles.role = 'manager')
    )
  );

-- Add index for performance on filtering by date/restaurant
CREATE INDEX IF NOT EXISTS idx_analytics_restaurant_date ON analytics(restaurant_id, created_at);
