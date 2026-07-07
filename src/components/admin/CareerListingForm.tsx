'use client'

import { useState } from 'react'
import Link from 'next/link'

type CareerListing = {
  id: string
  title: string
  department: string | null
  employment_type: string
  location: string | null
  description: string
  requirements: string | null
  is_active: boolean
}

export default function CareerListingForm({
  listing,
  action,
}: {
  listing?: CareerListing
  action: (formData: FormData) => Promise<void>
}) {
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
        <input
          name="title" required defaultValue={listing?.title}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            name="department" defaultValue={listing?.department ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment type</label>
          <select
            name="employment_type" defaultValue={listing?.employment_type ?? 'full_time'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            name="location" defaultValue={listing?.location ?? ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description" required rows={4} defaultValue={listing?.description}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
        <textarea
          name="requirements" rows={3} defaultValue={listing?.requirements ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input name="is_active" type="checkbox" defaultChecked={listing?.is_active ?? true} className="rounded" />
        Active (visible on the public site)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={submitting}
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/careers" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </form>
  )
}
