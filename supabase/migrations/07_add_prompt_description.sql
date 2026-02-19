-- Add description column to prompts table
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS description text;
