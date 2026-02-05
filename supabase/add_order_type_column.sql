ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS order_type text DEFAULT 'dine_in';
