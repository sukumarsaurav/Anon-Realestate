-- Compound indexes to optimize high-frequency frontend and backend queries

-- 1. Speed up duplicate lead checks on form submission in /api/lead
create index if not exists idx_leads_phone_created_at 
on public.leads(phone, created_at);

-- 2. Optimize queries fetching active featured projects (homepage/landing views)
create index if not exists idx_projects_active_featured_created_at 
on public.projects(is_active, is_featured, created_at desc);

-- 3. Optimize project filters (city, type, status) on Projects page browser
create index if not exists idx_projects_filters 
on public.projects(is_active, city, type, status);
