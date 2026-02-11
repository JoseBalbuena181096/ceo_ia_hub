-- Change category column from enum to text to allow dynamic categories
ALTER TABLE prompts 
ALTER COLUMN category TYPE text;

-- Optional: Drop the old enum type if you want to clean up
-- DROP TYPE IF EXISTS prompt_category;
