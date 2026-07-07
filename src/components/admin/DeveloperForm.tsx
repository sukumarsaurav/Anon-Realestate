'use client'

import { useState } from 'react'
import Link from 'next/link'
import ImageUploadField from './ImageUploadField'

type Developer = {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  sort_order: number
  is_active: boolean
}

export default function DeveloperForm({
  developer,
  action,
}: {
  developer?: Developer
  action: (formData: FormData) => Promise<void>
}) {
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="max-w-xl bg-white border border-gray-200 rounded-2xl p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          name="name" required defaultValue={developer?.name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <ImageUploadField
        name="logo_url"
        label="Logo"
        bucket="developers"
        defaultValue={developer?.logo_url}
        accept="image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (optional)</label>
        <input
          name="website_url" defaultValue={developer?.website_url ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
        <input
          name="sort_order" type="number" defaultValue={developer?.sort_order ?? 0}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input name="is_active" type="checkbox" defaultChecked={developer?.is_active ?? true} className="rounded" />
        Active (visible on the public site)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={submitting}
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/developers" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </form>
  )
}
