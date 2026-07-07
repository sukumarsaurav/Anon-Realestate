'use client'

import { useState } from 'react'

function CounterLabel({ label, length, good, warn }: { label: string; length: number; good: number; warn: number }) {
  const color = length === 0 ? 'text-gray-400' : length <= good ? 'text-success-600' : length <= warn ? 'text-warning-600' : 'text-danger-600'
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <span className={`text-xs ${color}`}>{length} chars</span>
    </div>
  )
}

export default function SeoFields({
  defaultMetaTitle,
  defaultMetaDescription,
  defaultCanonicalUrl,
  defaultOgImageUrl,
  defaultNoindex,
  fallbackTitle,
  urlPreview,
}: {
  defaultMetaTitle?: string | null
  defaultMetaDescription?: string | null
  defaultCanonicalUrl?: string | null
  defaultOgImageUrl?: string | null
  defaultNoindex?: boolean
  fallbackTitle: string
  urlPreview: string
}) {
  const [metaTitle, setMetaTitle] = useState(defaultMetaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(defaultMetaDescription ?? '')

  const previewTitle = metaTitle || fallbackTitle
  const previewDescription = metaDescription || 'No description set — Google will generate one from the page content.'

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Google preview</p>
        <p className="text-[#1a0dab] text-lg leading-snug truncate">{previewTitle}</p>
        <p className="text-[#006621] text-sm">{urlPreview}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{previewDescription}</p>
      </div>

      <div>
        <CounterLabel label="Meta title" length={metaTitle.length} good={60} warn={70} />
        <input
          name="meta_title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
          placeholder={fallbackTitle}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <CounterLabel label="Meta description" length={metaDescription.length} good={155} warn={160} />
        <textarea
          name="meta_description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL (optional override)</label>
        <input
          name="canonical_url" defaultValue={defaultCanonicalUrl ?? ''} placeholder={urlPreview}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Social share image (OG image) — falls back to the hero/featured image if empty</label>
        <input
          name="og_image_url" defaultValue={defaultOgImageUrl ?? ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input name="noindex" type="checkbox" defaultChecked={defaultNoindex ?? false} className="rounded mt-0.5" />
        <span>
          Hide from search engines (noindex)
          <span className="block text-xs text-warning-600 mt-0.5">This page will be excluded from Google search results.</span>
        </span>
      </label>
    </div>
  )
}
