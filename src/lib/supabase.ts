import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Single shared anon client — website only reads public data.
// Lazily created on first use (not at module load) so that `next build` can
// collect page data for static routes like /_not-found without the public env
// vars being inlined yet. Mirrors the pattern in supabaseAdmin.ts.
let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      throw new Error(
        'Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
      )
    }
    client = createClient(url, anon)
  }
  return client
}

// Proxy preserves the `import { supabase }` call sites unchanged while deferring
// client construction until the first property access at runtime.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const c = getClient()
    const value = Reflect.get(c as object, prop, receiver)
    return typeof value === 'function' ? value.bind(c) : value
  },
})
