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
-- Owners can update their own restaurant.
CREATE POLICY "Owners can update their restaurant" ON restaurants
  FOR UPDATE USING (
    id IN (SELECT restaurant_id FROM profiles WHERE id = auth.uid() AND role = 'owner')
  );

-- Everyone (authenticated) can view their own restaurant details.
CREATE POLICY "Members can view their restaurant" ON restaurants
  FOR SELECT USING (
    id = get_my_restaurant_id()
  );
  
-- Allow public "slug" lookup? (For customer facing pages - maybe later. Start strict.)
-- For now, strict SaaS internal access only.


-- 2. PROFILES
-- Users can view profiles in their same restaurant.
CREATE POLICY "View team members" ON profiles
  FOR SELECT USING (
    restaurant_id = get_my_restaurant_id()
  );

-- Users can update their own profile.
CREATE POLICY "Update own profile" ON profiles
  FOR UPDATE USING (
    id = auth.uid()
  );


-- 3. GENERIC RLS POLICY (Apply to all operational tables)
-- Logic: A user can ALL operations on rows where `restaurant_id` matches their own `restaurant_id`.

-- CATEGORIES
CREATE POLICY "Isolate categories" ON categories
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

-- MENU ITEMS
CREATE POLICY "Isolate menu items" ON menu_items
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

-- TABLES
CREATE POLICY "Isolate tables" ON tables
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

-- ORDERS
CREATE POLICY "Isolate orders" ON orders
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

-- ORDER ITEMS
CREATE POLICY "Isolate order items" ON order_items
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

-- CUSTOMERS
CREATE POLICY "Isolate customers" ON customers
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

-- LEADS
CREATE POLICY "Isolate leads" ON leads
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());


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

  -- 2. Create Profile for the current auth user
  INSERT INTO profiles (id, email, full_name, restaurant_id, role)
  VALUES (
    auth.uid(), 
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    owner_full_name, 
    new_restaurant_id, 
    'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
