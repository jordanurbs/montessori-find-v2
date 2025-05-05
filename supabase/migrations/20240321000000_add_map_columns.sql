-- Create function to add geocode_data column
CREATE OR REPLACE FUNCTION add_geocode_data_column()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'schools'
    AND column_name = 'geocode_data'
  ) THEN
    ALTER TABLE schools
    ADD COLUMN geocode_data JSONB;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to add static_map_url column
CREATE OR REPLACE FUNCTION add_static_map_url_column()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'schools'
    AND column_name = 'static_map_url'
  ) THEN
    ALTER TABLE schools
    ADD COLUMN static_map_url TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to add coordinates column
CREATE OR REPLACE FUNCTION add_coordinates_column()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'schools'
    AND column_name = 'coordinates'
  ) THEN
    ALTER TABLE schools
    ADD COLUMN coordinates JSONB;
  END IF;
END;
$$ LANGUAGE plpgsql; 