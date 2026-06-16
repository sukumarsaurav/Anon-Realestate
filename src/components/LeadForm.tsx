'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface Props {
  projectId?: string
  projectName?: string
  source?: string
  title?: string
  subtitle?: string
  compact?: boolean
  onSuccess?: () => void
}

export default function LeadForm({
  projectId,
  projectName,
  source = 'website',
  title = 'Get a Free Callback',
  subtitle = 'Our advisor will call you within 30 minutes.',
  compact = false,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)

    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:         fd.get('name'),
        phone:        fd.get('phone'),
        project_id:   projectId ?? null,
        project_name: projectName ?? fd.get('project_interest') ?? null,
        source,
        notes:        fd.get('notes') ?? null,
      }),
    })

    setLoading(false)
    if (res.ok) {
      setDone(true)
      onSuccess?.()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Something went wrong. Please try again.')
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle size={40} className="text-green-500 mb-3" />
        <p className="font-bold text-gray-900 text-lg">Thank you!</p>
        <p className="text-gray-500 text-sm mt-1">
          We&apos;ve received your details. Our advisor will call you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!compact && (
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      )}

      <div>
        <label htmlFor="lf-name" className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
        <input id="lf-name" name="name" required autoComplete="name" placeholder="e.g. Rahul Sharma"
          aria-invalid={!!error}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      </div>
      <div>
        <label htmlFor="lf-phone" className="block text-xs font-medium text-gray-600 mb-1">Mobile number</label>
        <input id="lf-phone" name="phone" type="tel" required autoComplete="tel" inputMode="numeric"
          placeholder="10-digit mobile"
          pattern="[6-9][0-9]{9}"
          title="Enter a valid 10-digit Indian mobile number"
          aria-describedby="lf-phone-hint" aria-invalid={!!error}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
        <p id="lf-phone-hint" className="sr-only">Enter a valid 10-digit Indian mobile number.</p>
      </div>

      {!projectId && (
        <div>
          <label htmlFor="lf-interest" className="block text-xs font-medium text-gray-600 mb-1">Project interest <span className="font-normal text-gray-500">(optional)</span></label>
          <select id="lf-interest" name="project_interest"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-400">
            <option value="">Any</option>
            <option>Plotted Development</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Commercial</option>
          </select>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-gold-500 text-brand-900 font-semibold rounded-xl hover:bg-gold-600 hover:text-white transition-colors disabled:opacity-50 text-sm">
        {loading ? 'Submitting...' : 'Request Callback'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        No spam, ever.
      </p>
    </form>
  )
}
