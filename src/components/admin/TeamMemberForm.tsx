'use client'

import { useState } from 'react'
import Link from 'next/link'

import ImageUploadField from './ImageUploadField'

type TeamMember = {
  id: string
  name: string
  designation: string | null
  level: string | null
  photo_url: string | null
  sort_order: number
  is_public: boolean
}

export default function TeamMemberForm({
  member,
  action,
  levels = ['leadership', 'advisor', 'operations'],
}: {
  member?: TeamMember
  action: (formData: FormData) => Promise<void>
  levels?: string[]
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
          name="name" required defaultValue={member?.name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
        <input
          name="designation" defaultValue={member?.designation ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
        <select
          name="level" defaultValue={member?.level ?? levels[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 capitalize"
        >
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl.replace(/[-_]/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      <ImageUploadField
        name="photo_url"
        label="Photo"
        bucket="team"
        defaultValue={member?.photo_url}
        accept="image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
        <input
          name="sort_order" type="number" defaultValue={member?.sort_order ?? 0}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input name="is_public" type="checkbox" defaultChecked={member?.is_public ?? true} className="rounded" />
        Public (visible on the public site)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={submitting}
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/team" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </form>
  )
}
