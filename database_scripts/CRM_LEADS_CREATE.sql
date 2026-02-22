-- Create CRM Leads and Deals Table
-- This is optional if you want to move away from LocalStorage and save deals in Supabase

CREATE TABLE IF NOT EXISTS public.crm_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('LEAD', 'DEAL')), -- LEAD or DEAL
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    value DECIMAL(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'WON', 'LOST')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.crm_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated admins to manage CRM items
CREATE POLICY "Admins can manage CRM items" ON public.crm_items
    FOR ALL
    TO authenticated
    USING (true) -- In a real app, restrict this to users with admin roles
    WITH CHECK (true);
