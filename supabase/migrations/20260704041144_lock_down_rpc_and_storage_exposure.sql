-- increment_blog_views is only ever called server-side via the service-role
-- client (src/app/api/blog-view/route.ts) — anon/authenticated don't need
-- direct RPC access to it.
revoke execute on function public.increment_blog_views(uuid) from public;
grant execute on function public.increment_blog_views(uuid) to service_role;

-- is_admin() is only used inside other tables' RLS policy expressions
-- (evaluated as the querying `authenticated` role) — anon never needs it.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- The `media` bucket is public, so object fetch-by-URL already bypasses RLS
-- entirely (that's what a public bucket means in Supabase Storage) — this
-- broad SELECT policy only adds the ability to LIST every object via the API,
-- which isn't needed. Admin list/browse operations go through the
-- service-role client instead, which bypasses RLS.
drop policy "public read media" on storage.objects;
