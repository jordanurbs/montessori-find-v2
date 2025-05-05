-- Add geocode_data column
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS geocode_data JSONB;

-- Add coordinates column
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS coordinates JSONB;

-- Add static_map_url column
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS static_map_url TEXT; 