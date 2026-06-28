'use client'

import { useState } from 'react'
import { Briefcase, MapPin, Clock, ChevronDown, CheckCircle } from 'lucide-react'
import { EMPLOYMENT_TYPE_LABELS } from '@/types'
import type { CareerListing } from '@/types'

function ApplicationForm({ listing, onClose }: { listing: CareerListing; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id:   listing.id,
        name:         fd.get('name'),
        phone:        fd.get('phone'),
        email:        fd.get('email'),
        cover_letter: fd.get('cover_letter'),
      }),
    })
    setLoading(false)
    if (res.ok) setDone(true)
    else setError('Failed to submit. Please try again.')
  }

  if (done) {
    return (
      <div className="py-8 text-center">
        <CheckCircle size={36} className="text-success-500 mx-auto mb-3" />
        <p className="font-serif font-semibold text-brand-900">Application Submitted!</p>
        <p className="text-sm text-gray-500 mt-1">Our HR team will reach out within 3 business days.</p>
        <button onClick={onClose} className="mt-4 text-sm text-gold-700 underline">Close</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <p className="text-sm font-semibold text-gray-800">Apply for: {listing.title}</p>
      <input name="name" required placeholder="Full Name"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      <input name="phone" type="tel" required placeholder="Phone Number"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      <input name="email" type="email" placeholder="Email (optional)"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      <textarea name="cover_letter" rows={3} placeholder="Why do you want to join ANON INDIA?"
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
      {error && <p className="text-xs text-danger-600">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onClose}
          className="px-4 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-cream">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 bg-gold-500 text-brand-900 text-sm font-semibold rounded-xl hover:bg-gold-600 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}

/** Interactive job-listing accordion + apply flow. The surrounding page shell
 *  stays a static server component; only this island ships client JS. */
export default function CareerListings({ listings }: { listings: CareerListing[] }) {
  const [applying, setApplying] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <Briefcase size={36} className="text-gray-300 mx-auto mb-3" />
        <p className="font-serif font-semibold text-brand-900">No open positions right now</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          We&apos;re always looking for great talent. Send us your profile anyway!
        </p>
        <a href="mailto:careers@anonindia.com"
          className="inline-block px-6 py-3 bg-gold-500 text-brand-900 font-semibold rounded-xl hover:bg-gold-600 text-sm">
          Send Your CV
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {listings.map((job) => (
        <div key={job.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setExpanded((v) => v === job.id ? null : job.id)}
            className="w-full flex items-start justify-between p-5 text-left">
            <div>
              <h3 className="font-serif font-semibold text-brand-900">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Briefcase size={13} />{job.department}</span>
                <span className="flex items-center gap-1"><MapPin size={13} />{job.location}</span>
                <span className="flex items-center gap-1"><Clock size={13} />{EMPLOYMENT_TYPE_LABELS[job.employment_type] ?? job.employment_type}</span>
              </div>
            </div>
            <ChevronDown size={18} className={`text-gray-500 mt-1 transition-transform shrink-0 ${expanded === job.id ? 'rotate-180' : ''}`} />
          </button>

          {expanded === job.id && (
            <div className="px-5 pb-5 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed mt-4 whitespace-pre-wrap">{job.description}</p>
              {job.requirements && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Requirements</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}

              {applying === job.id ? (
                <ApplicationForm listing={job} onClose={() => setApplying(null)} />
              ) : (
                <button onClick={() => setApplying(job.id)}
                  className="mt-4 px-6 py-2.5 bg-gold-500 text-brand-900 text-sm font-semibold rounded-xl hover:bg-gold-600">
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
