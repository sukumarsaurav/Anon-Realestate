'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // @supabase/ssr's browser client is built around cookie-synced PKCE code
    // exchange, not client-side implicit-flow hash parsing — it does not
    // auto-detect the access_token/refresh_token pair Supabase's recovery
    // email puts in the URL hash. Parse it ourselves and establish the
    // session explicitly via setSession(), which works regardless of the
    // client's auto-detection behavior.
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const access_token = hash.get('access_token')
    const refresh_token = hash.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ data, error }) => {
        if (data.session && !error) {
          setReady(true)
          // Drop the tokens from the URL so they aren't left in browser
          // history / visible in the address bar longer than necessary.
          window.history.replaceState(null, '', window.location.pathname)
        }
      })
      return
    }

    // No hash present (e.g. page reloaded after the session was already
    // established) — fall back to checking for a live session.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-xl text-brand-900">ANON INDIA</span>
          <p className="text-sm text-gray-500 mt-1">Set your admin password</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-soft p-6">
          {!ready ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Verifying your reset link…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-danger-700 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input
                  id="password" type="password" required autoFocus minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input
                  id="confirm" type="password" required minLength={8}
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-brand-900 text-white text-sm font-semibold rounded-lg py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Set password'}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/admin/login" className="text-brand-700 hover:text-brand-900 font-medium transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
