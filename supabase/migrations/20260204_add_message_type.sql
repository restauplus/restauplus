-- Add message_type column to admin_messages table
ALTER TABLE public.admin_messages 
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'IMPORTANT UPDATE';
