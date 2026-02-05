-- Allow Super Admins specific access or fix the role check
-- We'll drop the existing policy and recreate it to include specific emails OR role = 'admin'

DROP POLICY IF EXISTS "Admins can manage messages" ON public.admin_messages;

CREATE POLICY "Admins can manage messages" ON public.admin_messages
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (
                profiles.role = 'admin' 
                OR 
                auth.email() IN ('admin@restauplus.com', 'admin212123@restauplus.com', 'bensalahbader.business@gmail.com')
            )
        )
    );
