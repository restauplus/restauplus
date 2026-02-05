-- Create admin_message_reads table
CREATE TABLE IF NOT EXISTS public.admin_message_reads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    message_id UUID REFERENCES public.admin_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    UNIQUE(message_id, user_id) -- Prevent duplicate reads
);

-- Enable RLS
ALTER TABLE public.admin_message_reads ENABLE ROW LEVEL SECURITY;

-- Policies

-- Admins can see who read what
CREATE POLICY "Admins can view read receipts" ON public.admin_message_reads
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Owners can insert their own read receipt
CREATE POLICY "Owners can mark messages as read" ON public.admin_message_reads
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
    );

-- Owners can view their own read receipts (optional, but good for idempotency checks if needed)
CREATE POLICY "Owners can view own receipts" ON public.admin_message_reads
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
    );
