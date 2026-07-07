-- Migration to add custom city images column to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS city_images jsonb DEFAULT '[]'::jsonb;
