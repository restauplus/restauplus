-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES ENUM
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'staff');

-- 1. RESTAURANTS (Tenants)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  currency TEXT DEFAULT 'USD',
  logo_url TEXT
);

-- 2. USERS (Profiles) - Extends auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  role user_role DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. STAFF INVITATIONS
CREATE TABLE staff_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- 4. CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MENU ITEMS
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLES (Seating)
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  number TEXT NOT NULL,
  capacity INTEGER DEFAULT 4,
  qr_code_url TEXT,
  status TEXT DEFAULT 'available', -- available, occupied, reserved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- pending, preparing, ready, served, paid, cancelled
  total_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL, -- Denormalized for RLS performance
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  price_at_time DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. LEADS (Simple CRM)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  contact_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'new', -- new, contacted, qualified, lost, won
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Helper Function: Get Current User's Restaurant ID
CREATE OR REPLACE FUNCTION get_my_restaurant_id()
RETURNS UUID AS $$
  SELECT restaurant_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Validates that the current user belongs to the restaurant they are trying to access
CREATE OR REPLACE FUNCTION is_restaurant_member(res_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND restaurant_id = res_id
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- 1. RESTAURANTS
CREATE POLICY "Admins see all, members see own" ON restaurants
  FOR SELECT USING ( is_admin() OR id = get_my_restaurant_id() );

CREATE POLICY "Owners can update their restaurant" ON restaurants
  FOR UPDATE USING ( is_admin() OR (id = get_my_restaurant_id() AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner')) );
  
-- Allow public "slug" lookup? (For customer facing pages - maybe later. Start strict.)
-- For now, strict SaaS internal access only.


-- 2. PROFILES
CREATE POLICY "Admins see all, members see team" ON profiles
  FOR SELECT USING ( is_admin() OR restaurant_id = get_my_restaurant_id() OR id = auth.uid() );

-- 3. OPERATIONAL TABLES (Isolate + Admin Bypass)
-- CATEGORIES
DROP POLICY IF EXISTS "Isolate categories" ON categories;
CREATE POLICY "Isolate categories" ON categories
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());

-- MENU ITEMS
DROP POLICY IF EXISTS "Isolate menu items" ON menu_items;
CREATE POLICY "Isolate menu items" ON menu_items
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());

-- TABLES
DROP POLICY IF EXISTS "Isolate tables" ON tables;
CREATE POLICY "Isolate tables" ON tables
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());

-- ORDERS
DROP POLICY IF EXISTS "Isolate orders" ON orders;
CREATE POLICY "Isolate orders" ON orders
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());

-- ORDER ITEMS
DROP POLICY IF EXISTS "Isolate order items" ON order_items;
CREATE POLICY "Isolate order items" ON order_items
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());

-- CUSTOMERS
DROP POLICY IF EXISTS "Isolate customers" ON customers;
CREATE POLICY "Isolate customers" ON customers
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());

-- LEADS
DROP POLICY IF EXISTS "Isolate leads" ON leads;
CREATE POLICY "Isolate leads" ON leads
  USING (is_admin() OR restaurant_id = get_my_restaurant_id())
  WITH CHECK (is_admin() OR restaurant_id = get_my_restaurant_id());


-- =============================================
-- TRIGGERS & AUTOMATION
-- =============================================

-- Auto-create profile on signup (Trigger)
-- This assumes the frontend or a separate function handles the initial "Owner" setup which is complex.
-- Alternative: We manually insert into `profiles` after `auth.signUp` in the frontend flow using a Postgres function is safer.

-- Function to handle new restaurant signup
CREATE OR REPLACE FUNCTION handle_new_owner_signup(
  restaurant_name TEXT,
  restaurant_slug TEXT,
  owner_full_name TEXT
) RETURNS VOID AS $$
DECLARE
  new_restaurant_id UUID;
BEGIN
  -- 1. Create Restaurant
  INSERT INTO restaurants (name, slug) 
  VALUES (restaurant_name, restaurant_slug) 
  RETURNING id INTO new_restaurant_id;

  -- 2. Create or Update Profile for the current auth user
  INSERT INTO public.profiles (id, email, full_name, restaurant_id, role, status)
  VALUES (
    auth.uid(), 
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    owner_full_name, 
    new_restaurant_id, 
    'owner',
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    restaurant_id = EXCLUDED.restaurant_id,
    role = 'owner';
    -- We DON'T update status to 'pending' on conflict to avoid locking out approved users
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
