-- Admin uploads to the blog / projects / team / developers buckets were failing
-- with "new row violates row-level security policy": only the `media` bucket
-- had write policies (see initial_schema). These buckets are public for reads
-- (object fetch-by-URL bypasses RLS), so only write access is added here,
-- restricted to admins exactly like the `media` bucket.

create policy "admins write site buckets" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('blog', 'projects', 'team', 'developers') and public.is_admin());

create policy "admins update site buckets" on storage.objects
  for update to authenticated
  using (bucket_id in ('blog', 'projects', 'team', 'developers') and public.is_admin())
  with check (bucket_id in ('blog', 'projects', 'team', 'developers') and public.is_admin());

create policy "admins delete site buckets" on storage.objects
  for delete to authenticated
  using (bucket_id in ('blog', 'projects', 'team', 'developers') and public.is_admin());
