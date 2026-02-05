-- Add read_at column if it's missing (it was missing in original migration)
ALTER TABLE public.admin_message_reads 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ DEFAULT now();

-- Ensure policies are definitely open (Just in case)
DROP POLICY IF EXISTS "Anyone authenticated can insert read receipt" ON public.admin_message_reads;
CREATE POLICY "Anyone authenticated can insert read receipt" ON public.admin_message_reads
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
