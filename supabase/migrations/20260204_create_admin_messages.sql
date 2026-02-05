-- Create admin_messages table
CREATE TABLE IF NOT EXISTS public.admin_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    content TEXT NOT NULL,
    target_user_ids UUID[] DEFAULT NULL, -- Array of User IDs. If NULL, could mean 'All', but we'll stick to explicit targeting for now.
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.admin_messages ENABLE ROW LEVEL SECURITY;

-- Policies

-- Admins can do everything
CREATE POLICY "Admins can manage messages" ON public.admin_messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Owners can read messages targeted to them
CREATE POLICY "Owners can read their messages" ON public.admin_messages
    FOR SELECT
    USING (
        is_active = true
        AND (
            target_user_ids IS NULL 
            OR 
            auth.uid() = ANY(target_user_ids)
        )
    );
