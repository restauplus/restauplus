-- Create table for global platform settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Enforce single row
    maintenance_mode BOOLEAN DEFAULT false,
    gpt_engine TEXT DEFAULT 'gpt-4',
    allow_registrations BOOLEAN DEFAULT true,
    auto_approve_domains TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Insert the default row if it doesn't exist
INSERT INTO public.platform_settings (id, maintenance_mode)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

-- Policies

-- 1. PUBLIC READ (Everyone needs to know if we are in maintenance mode)
CREATE POLICY "Public Read Settings" ON public.platform_settings
    FOR SELECT USING (true);

-- 2. ADMIN UPDATE (Only admins can change settings)
-- Using the 'admin' role check from profiles
CREATE POLICY "Admins Update Settings" ON public.platform_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
