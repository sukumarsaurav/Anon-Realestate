-- Initial CMS schema for the new Supabase project.
-- Recreates the existing content tables (previously living in project
-- dfjyslxrzniqtlniseat) plus new CMS/SEO/admin tables.
--
-- NOTE: `leads`, `career_applications` column shapes are inferred from
-- src/app/api/lead/route.ts, brochure/route.ts, apply/route.ts insert
-- payloads. `leads.source` / `leads.stage` look enum-backed in the old
-- project ("valid lead_source enum value" comment in route.ts) — kept as
-- plain `text` here since the old DB's actual enum values aren't
-- confirmed yet. Tighten to a `check` constraint or real enum once the
-- old project's DDL is available.

create extension if not exists pgcrypto;

-- ============================================================
-- Content tables (existing site data)
-- ============================================================

create table public.developers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website_url text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.projects (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  type                      text not null,
  city                      text not null,
  locality                  text,
  address                   text,
  status                    text not null default 'pre_launch',
  description               text,
  gallery_urls              text[] not null default '{}',
  brochure_url              text,
  rera_number               text,
  rera_registration_date    date,
  rera_expiry_date          date,
  total_units               int,
  expected_completion_date  date,
  launch_date               date,
  amenities                 text[] not null default '{}',
  google_maps_pin           text,
  video_url                 text,
  virtual_tour_url          text,
  layout_image_url          text,
  developer_id              uuid references public.developers(id),
  starting_price            numeric,
  price_per_sqft            numeric,
  bhk_config                text,
  website_category          text,
  is_featured               boolean not null default false,
  hero_image_url            text,
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  -- Optional editorial content (see former migration 20260616000000).
  developer_about           text,
  usp                       text[] not null default '{}',
  connectivity              jsonb not null default '[]'::jsonb,
  faqs                      jsonb not null default '[]'::jsonb,
  -- SEO
  meta_title                text,
  meta_description          text,
  canonical_url             text,
  og_image_url              text,
  noindex                   boolean not null default false
);
comment on column public.projects.developer_about is 'About-the-developer copy shown on the project detail page.';
comment on column public.projects.usp is 'Why-Invest highlight bullets (plain strings).';
comment on column public.projects.connectivity is 'Location advantages: [{ place, distance }].';
comment on column public.projects.faqs is 'Curated FAQs: [{ q, a }]. Overrides auto-generated FAQs when present.';

create table public.plots (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  plot_number text not null,
  size_sqyd   numeric,
  size_sqft   numeric,
  facing      text,
  type        text,
  base_price  numeric,
  total_price numeric,
  status      text not null default 'available'
);

create table public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  designation text,
  level       text,
  photo_url   text,
  sort_order  int not null default 0,
  is_public   boolean not null default true
);

create table public.blog_posts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  excerpt            text,
  content            text not null default '',
  featured_image_url text,
  category           text not null default 'general',
  tags               text[] not null default '{}',
  meta_title         text,
  meta_description   text,
  canonical_url      text,
  og_image_url       text,
  noindex            boolean not null default false,
  is_published       boolean not null default false,
  published_at       timestamptz,
  author_id          uuid,
  view_count         int not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  client_name text not null,
  project     text,
  content     text not null,
  rating      int not null default 5 check (rating between 1 and 5),
  photo_url   text,
  is_active   boolean not null default true,
  sort_order  int not null default 0
);

create table public.career_listings (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  department      text,
  employment_type text not null default 'full_time',
  location        text,
  description     text not null default '',
  requirements    text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create table public.career_applications (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid references public.career_listings(id) on delete set null,
  name          text not null,
  phone         text not null,
  email         text,
  cover_letter  text,
  created_at    timestamptz not null default now()
);

create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  phone       text not null,
  email       text,
  city        text,
  source      text not null default 'website_form',
  utm_source  text,
  utm_medium  text,
  stage       text not null default 'new_lead',
  project_id  uuid references public.projects(id) on delete set null,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.lead_activities (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads(id) on delete cascade,
  type       text not null default 'note',
  notes      text,
  created_at timestamptz not null default now()
);

-- Recreates the RPC used by src/app/api/blog-view/route.ts.
create or replace function public.increment_blog_views(post_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.blog_posts set view_count = view_count + 1 where id = post_id;
$$;

-- ============================================================
-- CMS / SEO / admin tables
-- ============================================================

create table public.site_settings (
  id                        int primary key default 1 check (id = 1),
  site_name                 text not null default 'ANON INDIA',
  default_title_template    text not null default '%s | ANON INDIA',
  default_meta_description  text,
  default_og_image_url      text,
  ga_measurement_id         text,
  meta_pixel_id             text,
  whatsapp_number           text,
  contact_email             text,
  contact_phone             text,
  org_schema                jsonb not null default '{}'::jsonb,
  updated_at                timestamptz not null default now()
);
insert into public.site_settings (id) values (1);

create table public.redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text not null unique,
  to_path     text not null,
  status_code int not null default 301 check (status_code in (301, 302, 307, 308)),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.pages (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  hero_eyebrow      text,
  hero_title        text,
  hero_subtitle     text,
  hero_image_url    text,
  blocks            jsonb not null default '[]'::jsonb,
  meta_title        text,
  meta_description  text,
  updated_at        timestamptz not null default now()
);

create table public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'admin',
  full_name  text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- SECURITY DEFINER so this can check admin_users without triggering
-- infinite recursion when used inside admin_users' own RLS policies
-- (a plain `exists (select ... from admin_users)` subquery inside an
-- admin_users policy would recursively re-invoke that same policy).
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

alter table public.developers          enable row level security;
alter table public.projects            enable row level security;
alter table public.plots               enable row level security;
alter table public.team_members        enable row level security;
alter table public.blog_posts          enable row level security;
alter table public.testimonials        enable row level security;
alter table public.career_listings     enable row level security;
alter table public.career_applications enable row level security;
alter table public.leads               enable row level security;
alter table public.lead_activities     enable row level security;
alter table public.site_settings       enable row level security;
alter table public.redirects           enable row level security;
alter table public.pages               enable row level security;
alter table public.admin_users         enable row level security;

-- developers: public reads active rows, admins manage all
create policy "public read active developers" on public.developers
  for select to anon, authenticated using (is_active = true);
create policy "admins manage developers" on public.developers
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- projects
create policy "public read active projects" on public.projects
  for select to anon, authenticated using (is_active = true);
create policy "admins manage projects" on public.projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- plots: readable when parent project is active
create policy "public read plots of active projects" on public.plots
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = plots.project_id and p.is_active = true));
create policy "admins manage plots" on public.plots
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- team_members
create policy "public read public team members" on public.team_members
  for select to anon, authenticated using (is_public = true);
create policy "admins manage team members" on public.team_members
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- blog_posts
create policy "public read published blog posts" on public.blog_posts
  for select to anon, authenticated using (is_published = true);
create policy "admins manage blog posts" on public.blog_posts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- testimonials
create policy "public read active testimonials" on public.testimonials
  for select to anon, authenticated using (is_active = true);
create policy "admins manage testimonials" on public.testimonials
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- career_listings
create policy "public read active career listings" on public.career_listings
  for select to anon, authenticated using (is_active = true);
create policy "admins manage career listings" on public.career_listings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- career_applications: PII — anon can insert only, admins can read/manage
create policy "anon can submit applications" on public.career_applications
  for insert to anon with check (true);
create policy "admins manage career applications" on public.career_applications
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- leads: PII — anon can insert only, admins can read/manage
create policy "anon can submit leads" on public.leads
  for insert to anon with check (true);
create policy "admins manage leads" on public.leads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- lead_activities: PII — service role only in practice, admins can read/manage
create policy "admins manage lead activities" on public.lead_activities
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- site_settings: public read, admin write
create policy "public read site settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins manage site settings" on public.site_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- redirects: public read (middleware uses anon/service client), admin write
create policy "public read active redirects" on public.redirects
  for select to anon, authenticated using (is_active = true);
create policy "admins manage redirects" on public.redirects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- pages: public read, admin write
create policy "public read pages" on public.pages
  for select to anon, authenticated using (true);
create policy "admins manage pages" on public.pages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- admin_users: only admins can see the allowlist (self or others)
create policy "admins read admin users" on public.admin_users
  for select to authenticated
  using (public.is_admin());
create policy "admins manage admin users" on public.admin_users
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- Storage
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

create policy "admins write media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "admins update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "admins delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
