-- Fix RLS policy to allow Super Admins by user ID
-- First, let's make it simpler and more permissive

DROP POLICY IF EXISTS "Admins can manage messages" ON public.admin_messages;

-- Create a more permissive policy that checks auth.uid() directly
CREATE POLICY "Admins can manage messages" ON public.admin_messages
    FOR ALL
    USING (
        -- Allow if user has admin role
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
        OR
        -- Allow specific user IDs (replace with your actual user ID if needed)
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email IN (
                'admin@restauplus.com', 
                'admin212123@restauplus.com', 
                'bensalahbader.business@gmail.com'
            )
        )
    )
    WITH CHECK (
        -- Same check for INSERT/UPDATE
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
        OR
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email IN (
                'admin@restauplus.com', 
                'admin212123@restauplus.com', 
                'bensalahbader.business@gmail.com'
            )
        )
    );
