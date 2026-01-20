-- Add currency column to restaurants table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'currency') THEN
        ALTER TABLE restaurants ADD COLUMN currency TEXT DEFAULT 'USD';
    END IF;
END $$;
