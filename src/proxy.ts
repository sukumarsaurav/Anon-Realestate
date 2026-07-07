import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Small in-memory cache so we're not hitting Postgres for the redirects
// table on every single request in this Edge isolate — refreshed every 5min.
let redirectsCache: { map: Map<string, { to: string; status: number }>; expiresAt: number } | null = null

async function getRedirectsMap(): Promise<Map<string, { to: string; status: number }>> {
  if (redirectsCache && redirectsCache.expiresAt > Date.now()) return redirectsCache.map

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const map = new Map<string, { to: string; status: number }>()

  if (url && anonKey) {
    try {
      const res = await fetch(
        `${url}/rest/v1/redirects?select=from_path,to_path,status_code&is_active=eq.true`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
      )
      if (res.ok) {
        const rows: { from_path: string; to_path: string; status_code: number }[] = await res.json()
        for (const r of rows) map.set(r.from_path, { to: r.to_path, status: r.status_code })
      }
    } catch {
      // Redirects are a nice-to-have; fail open rather than block the request.
    }
  }

  redirectsCache = { map, expiresAt: Date.now() + 5 * 60 * 1000 }
  return map
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. DB-editable redirects (skip for /admin and /api — those shouldn't be
  //    silently rewritten by content-editor-managed redirects).
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const redirect = (await getRedirectsMap()).get(pathname)
    if (redirect) {
      return NextResponse.redirect(new URL(redirect.to, request.url), redirect.status)
    }
  }

  // 2. /admin auth gate. /admin/reset-password is exempt too — Supabase's
  // recovery link lands there and establishes a session client-side via a
  // URL hash fragment, which the server never sees, so gating it here would
  // bounce the user back to /login before that JS ever runs.
  const ADMIN_PUBLIC_PATHS = ['/admin/login', '/admin/reset-password']
  if (pathname.startsWith('/admin') && !ADMIN_PUBLIC_PATHS.includes(pathname)) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      },
    )

    const { data: { user } } = await supabase.auth.getUser()

    const redirectToLogin = (error?: string) => {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('redirect', pathname)
      if (error) loginUrl.searchParams.set('error', error)
      return NextResponse.redirect(loginUrl)
    }

    if (!user) return redirectToLogin()

    const { data: adminRow } = await supabase.from('admin_users').select('id').eq('id', user.id).maybeSingle()
    if (!adminRow) return redirectToLogin('not_authorized')

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
