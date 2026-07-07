-- Add theme_name column to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS theme_name text DEFAULT 'obsidian-gold';
