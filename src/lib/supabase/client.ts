import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client for admin auth flows (password reset, sign-in
// state) — uses @supabase/ssr's cookie-backed client so the session stays in
// sync with the server client in src/lib/supabase/server.ts and proxy.ts.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
