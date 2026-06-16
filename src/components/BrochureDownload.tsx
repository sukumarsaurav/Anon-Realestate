'use client'

import { useState } from 'react'
import { Download, CheckCircle } from 'lucide-react'

interface Props {
  projectId: string
  projectName: string
  brochureUrl: string
}

export default function BrochureDownload({ projectId, projectName, brochureUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)

    const res = await fetch('/api/brochure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        fd.get('name'),
        phone:       fd.get('phone'),
        project_id:  projectId,
        project_name: projectName,
        brochure_url: brochureUrl,
      }),
    })

    setLoading(false)
    if (res.ok) {
      setDone(true)
      window.open(brochureUrl, '_blank')
    } else {
      setError('Failed to submit. Please try again.')
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 text-success-700 text-sm">
        <CheckCircle size={16} />
        <span>Brochure downloading...</span>
      </div>
    )
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:border-gold-400 hover:text-gold-700 transition-colors">
        <Download size={16} /> Download Brochure
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Enter your details to download</p>
      <input name="name" required placeholder="Your Name"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      <input name="phone" type="tel" required placeholder="Phone Number"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      {error && <p className="text-xs text-danger-600">{error}</p>}
      <button type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-gold-500 text-brand-900 text-sm font-semibold rounded-xl hover:bg-gold-600 hover:text-white disabled:opacity-50">
        <Download size={15} />
        {loading ? 'Processing...' : 'Download Brochure'}
      </button>
    </form>
  )
}
