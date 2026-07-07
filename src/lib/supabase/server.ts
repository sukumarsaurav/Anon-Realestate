import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Session-aware Supabase client for Server Components / Server Actions under
// /admin. Distinct from the anon singleton in src/lib/supabase.ts (public
// site, no auth) and the service-role client in src/lib/supabaseAdmin.ts
// (privileged writes, bypasses RLS) — this one carries the logged-in admin's
// session so RLS's `is_admin()` checks apply correctly.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component render — middleware refreshes the
            // session cookie on the next request instead.
          }
        },
      },
    },
  )
}
