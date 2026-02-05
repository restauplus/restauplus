-- Fix Read Receipts RLS - Allow all authenticated users to insert
DROP POLICY IF EXISTS "Owners can mark messages as read" ON public.admin_message_reads;
DROP POLICY IF EXISTS "Owners can view own receipts" ON public.admin_message_reads;
DROP POLICY IF EXISTS "Admins can view read receipts" ON public.admin_message_reads;

-- Recreate policies with simpler permissions
CREATE POLICY "Anyone authenticated can insert read receipt" ON public.admin_message_reads
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Anyone authenticated can view read receipts" ON public.admin_message_reads
    FOR SELECT
    TO authenticated
    USING (true);
