'use client'

import { useState } from 'react'
import Link from 'next/link'

import ImageUploadField from './ImageUploadField'

type Testimonial = {
  id: string
  client_name: string
  project: string | null
  content: string
  rating: number
  photo_url: string | null
  sort_order: number
  is_active: boolean
}

export default function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: Testimonial
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Client name</label>
        <input
          name="client_name" required defaultValue={testimonial?.client_name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project (optional)</label>
        <input
          name="project" defaultValue={testimonial?.project ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
        <textarea
          name="content" required rows={4} defaultValue={testimonial?.content}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
          <input
            name="rating" type="number" min={1} max={5} required defaultValue={testimonial?.rating ?? 5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
          <input
            name="sort_order" type="number" defaultValue={testimonial?.sort_order ?? 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      <ImageUploadField
        name="photo_url"
        label="Client Photo"
        bucket="media"
        defaultValue={testimonial?.photo_url}
        accept="image"
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input name="is_active" type="checkbox" defaultChecked={testimonial?.is_active ?? true} className="rounded" />
        Active (visible on the public site)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={submitting}
          className="bg-brand-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <Link href="/admin/testimonials" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </form>
  )
}
