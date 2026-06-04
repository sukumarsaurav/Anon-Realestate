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
        <input name="name" required placeholder="Your Name"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <input name="phone" type="tel" required placeholder="Phone Number"
          pattern="[6-9][0-9]{9}"
          title="Enter a valid 10-digit Indian mobile number"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {!projectId && (
        <div>
          <select name="project_interest"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Project Interest (optional)</option>
            <option>Plotted Development</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Commercial</option>
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm">
        {loading ? 'Submitting...' : 'Request Callback'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        By submitting, you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a>.
        No spam, ever.
      </p>
    </form>
  )
}
