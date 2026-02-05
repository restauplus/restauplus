-- Add plain_password column to profiles table for admin reference (Insecure but requested)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plain_password TEXT;

-- Comment to explain why this exists
COMMENT ON COLUMN public.profiles.plain_password IS 'Stores user password in plain text for admin reference. SECURITY WARNING: This is visible to admins.';
