-- Missing indexes on foreign key columns (flagged by performance advisor).
create index if not exists idx_projects_developer_id on public.projects(developer_id);
create index if not exists idx_plots_project_id on public.plots(project_id);
create index if not exists idx_leads_project_id on public.leads(project_id);
create index if not exists idx_lead_activities_lead_id on public.lead_activities(lead_id);
create index if not exists idx_career_applications_listing_id on public.career_applications(listing_id);

-- "public read ..." policies were scoped to (anon, authenticated), which
-- overlaps with the "admins manage ..." (for all, incl. select) policies
-- for the authenticated role — Postgres has to evaluate both permissive
-- policies on every authenticated SELECT. This app has no concept of a
-- non-admin authenticated user (single-admin model), so scope public-read
-- policies to anon only; authenticated access is fully covered by the
-- admin-manage policies.
alter policy "public read active developers"       on public.developers          to anon;
alter policy "public read active projects"          on public.projects            to anon;
alter policy "public read plots of active projects" on public.plots               to anon;
alter policy "public read public team members"      on public.team_members        to anon;
alter policy "public read published blog posts"     on public.blog_posts          to anon;
alter policy "public read active testimonials"      on public.testimonials        to anon;
alter policy "public read active career listings"   on public.career_listings     to anon;
alter policy "public read site settings"            on public.site_settings       to anon;
alter policy "public read active redirects"         on public.redirects           to anon;
alter policy "public read pages"                    on public.pages               to anon;

-- admin_users: the "admins manage" (for all) policy already covers select
-- for authenticated; the separate "admins read" select policy was redundant.
drop policy "admins read admin users" on public.admin_users;
