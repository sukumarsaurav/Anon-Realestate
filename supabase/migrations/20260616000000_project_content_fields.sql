-- Optional editorial content for the project detail page.
-- All nullable / default-empty so existing rows and the website keep working;
-- the page falls back to data-derived content when these are empty.

alter table public.projects
  add column if not exists developer_about text,
  -- Selling points shown in "Why Invest" (plain strings, e.g. "0% pre-EMI till possession").
  add column if not exists usp text[] not null default '{}',
  -- Connectivity / location advantages: array of { "place": string, "distance": string }.
  add column if not exists connectivity jsonb not null default '[]'::jsonb,
  -- Curated FAQs: array of { "q": string, "a": string }. Overrides the auto-generated ones.
  add column if not exists faqs jsonb not null default '[]'::jsonb;

comment on column public.projects.developer_about is 'About-the-developer copy shown on the project detail page.';
comment on column public.projects.usp is 'Why-Invest highlight bullets (plain strings).';
comment on column public.projects.connectivity is 'Location advantages: [{ place, distance }].';
comment on column public.projects.faqs is 'Curated FAQs: [{ q, a }]. Overrides auto-generated FAQs when present.';
