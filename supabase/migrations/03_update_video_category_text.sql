-- First, remove the default value which depends on the enum
ALTER TABLE videos ALTER COLUMN category DROP DEFAULT;

-- Then change the column type to text
ALTER TABLE videos ALTER COLUMN category TYPE text;

-- Finally, drop the old enum type safely
DROP TYPE IF EXISTS video_category;
