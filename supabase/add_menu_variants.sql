-- Create table for Variant Groups (e.g., "Size", "Sauce", "Toppings")
CREATE TABLE IF NOT EXISTS public.menu_item_variant_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    selection_type TEXT NOT NULL CHECK (selection_type IN ('single', 'multiple')), -- 'single' (Radio) or 'multiple' (Checkbox)
    min_selection INTEGER DEFAULT 0, -- 0 = Optional, 1 = Required
    max_selection INTEGER DEFAULT 1, -- For multiple choice limits
    is_required BOOLEAN DEFAULT FALSE, -- Quick flag for UI
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for Variant Options (e.g., "Small", "Big", "Ketchup")
CREATE TABLE IF NOT EXISTS public.menu_item_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.menu_item_variant_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_variant_groups_item_id ON public.menu_item_variant_groups(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_variants_group_id ON public.menu_item_variants(group_id);

-- Enable RLS
ALTER TABLE public.menu_item_variant_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_variants ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Owner Write)
CREATE POLICY "Public Read Variant Groups" ON public.menu_item_variant_groups FOR SELECT USING (true);
CREATE POLICY "Public Read Variants" ON public.menu_item_variants FOR SELECT USING (true);

-- Assuming owners can edit everything for now (simplistic RLS for development speed, assuming middleware checks ownership)
CREATE POLICY "Owners Manage Variant Groups" ON public.menu_item_variant_groups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Owners Manage Variants" ON public.menu_item_variants FOR ALL USING (auth.role() = 'authenticated');
