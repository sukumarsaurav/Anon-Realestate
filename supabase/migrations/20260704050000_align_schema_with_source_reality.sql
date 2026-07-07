-- Correcting earlier guesses now that the old project's real schema is known.
-- Only carrying over columns that are genuinely website/content-relevant;
-- deliberately dropping CRM-workflow-only fields (branch/staff assignment,
-- plot-hold internals, HR/interview fields, quarterly compliance cadence)
-- since those belong to the separate CRM system that stays on the old project.

-- projects: gallery_urls/amenities are jsonb in the source, not text[] —
-- match that so the data-copy script doesn't need array<->jsonb casting.
-- Both already deserialize to plain JS arrays via supabase-js either way.
alter table public.projects
  alter column gallery_urls drop default,
  alter column gallery_urls type jsonb using to_jsonb(gallery_urls),
  alter column gallery_urls set default '[]'::jsonb,
  alter column amenities drop default,
  alter column amenities type jsonb using to_jsonb(amenities),
  alter column amenities set default '[]'::jsonb;

alter table public.projects
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists rera_authority_name text,
  add column if not exists rera_website_url text;

-- leads: the source table has no `notes` column at all (notes for a lead go
-- into lead_activities instead, matching src/app/api/lead/route.ts) — drop
-- the column I incorrectly added. Add the fields relevant to the /admin/leads
-- view; omit FKs to CRM-only tables that aren't being migrated (assigned_to,
-- branch_id, broker_id, referred_by_client_id, created_by, reviewed_by).
alter table public.leads drop column if exists notes;
alter table public.leads
  add column if not exists alternate_phone text,
  add column if not exists locality text,
  add column if not exists property_type text,
  add column if not exists budget_min numeric,
  add column if not exists budget_max numeric,
  add column if not exists configuration text,
  add column if not exists purpose text,
  add column if not exists timeline text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists campaign_name text,
  add column if not exists ad_set_name text,
  add column if not exists keyword text,
  add column if not exists landing_page_url text,
  add column if not exists device_type text,
  add column if not exists temperature text default 'cold',
  add column if not exists score int default 0,
  add column if not exists next_followup_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists follow_up_count int default 0,
  add column if not exists whatsapp_opt_in boolean default true,
  add column if not exists is_duplicate boolean default false,
  add column if not exists duplicate_of uuid references public.leads(id),
  add column if not exists is_active boolean default true,
  add column if not exists loss_reason text;

-- lead_activities: add fields relevant to a call/activity timeline view.
alter table public.lead_activities
  add column if not exists outcome text,
  add column if not exists stage_from text,
  add column if not exists stage_to text,
  add column if not exists call_duration_seconds int,
  add column if not exists scheduled_at timestamptz,
  add column if not exists call_sid text,
  add column if not exists recording_url text;

-- plots: add real pricing/config fields used by the source data.
alter table public.plots
  add column if not exists type text default 'regular',
  add column if not exists facing text,
  add column if not exists floor_number int,
  add column if not exists configuration text,
  add column if not exists corner_premium numeric default 0,
  add column if not exists facing_premium numeric default 0,
  add column if not exists other_premium numeric default 0,
  add column if not exists development_charges numeric default 0,
  add column if not exists notes text,
  add column if not exists updated_at timestamptz default now(),
  add column if not exists base_price_per_sqyd numeric,
  add column if not exists grid_row int,
  add column if not exists grid_col int;

-- career_applications: add the recruiting-workflow fields present in source
-- (useful for an eventual careers/applications admin view; interviewer_id/
-- reviewed_by omitted since they'd reference a CRM staff table we don't have).
alter table public.career_applications
  add column if not exists resume_url text,
  add column if not exists status text default 'new',
  add column if not exists stage text default 'applied',
  add column if not exists current_company text,
  add column if not exists current_ctc numeric,
  add column if not exists expected_ctc numeric,
  add column if not exists experience_years numeric,
  add column if not exists interview_date timestamptz,
  add column if not exists interview_mode text,
  add column if not exists interview_rating int,
  add column if not exists interview_feedback text,
  add column if not exists offer_ctc numeric,
  add column if not exists offer_date date,
  add column if not exists joining_date date,
  add column if not exists rejection_reason text,
  add column if not exists updated_at timestamptz not null default now();
