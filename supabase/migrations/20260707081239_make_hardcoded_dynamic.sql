-- Migration to add dynamic content fields to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS address text DEFAULT 'Jaipur, Rajasthan, India',
  ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT 'https://facebook.com',
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT 'https://instagram.com',
  ADD COLUMN IF NOT EXISTS twitter_url text DEFAULT 'https://twitter.com',
  ADD COLUMN IF NOT EXISTS youtube_url text DEFAULT 'https://youtube.com',
  ADD COLUMN IF NOT EXISTS linkedin_url text DEFAULT 'https://linkedin.com',
  ADD COLUMN IF NOT EXISTS rera_registrations jsonb DEFAULT '["Rajasthan — RAJ/P/XXXX/XXXX", "UP — UPRERAAGTXXXXX", "Haryana — RC/HARERA/XXXX"]'::jsonb,
  ADD COLUMN IF NOT EXISTS instagram_reels jsonb DEFAULT '[
    {"image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600", "caption": "Anon Greens — site visit"},
    {"image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600", "caption": "Jaipur project tour"},
    {"image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600", "caption": "Inside a premium 3BHK"},
    {"image_url": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600", "caption": "Plot handover day"},
    {"image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600", "caption": "Township aerial tour"},
    {"image_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600", "caption": "Happy homeowner story"}
  ]'::jsonb,
  ADD COLUMN IF NOT EXISTS why_choose_us jsonb DEFAULT '[
    {"icon": "ShieldCheck", "title": "RERA Verified", "description": "Only compliant, verified projects make our list."},
    {"icon": "Headphones", "title": "Customer Oriented", "description": "Genuine advice and proactive follow-up, always."},
    {"icon": "Cpu", "title": "Tech Enabled", "description": "Modern CRM, instant updates, zero paperwork hassle."},
    {"icon": "Award", "title": "Proven Track Record", "description": "15+ years and thousands of happy investors."}
  ]'::jsonb,
  ADD COLUMN IF NOT EXISTS lead_capture_bullets jsonb DEFAULT '[
    "RERA-verified projects only",
    "No-pressure, advisory-first approach",
    "15+ years, 2,500+ investors served"
  ]'::jsonb,
  ADD COLUMN IF NOT EXISTS team_levels jsonb DEFAULT '["leadership", "advisor", "operations"]'::jsonb;
