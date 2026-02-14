-- Add google_maps_link column to restaurants table if it doesn't exist
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS google_maps_link TEXT;

-- Update RLS policies if necessary (usually not needed for adding columns if update policy is already set for owners)
