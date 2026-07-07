-- Supabase grants EXECUTE on new functions directly to anon/authenticated
-- via default privileges at creation time — revoking from PUBLIC alone
-- (previous migration) doesn't remove those direct grants. Revoke explicitly.
revoke execute on function public.increment_blog_views(uuid) from anon, authenticated;
revoke execute on function public.is_admin() from anon;
-- authenticated still needs is_admin() for the admin-write RLS policies.
grant execute on function public.is_admin() to authenticated;
