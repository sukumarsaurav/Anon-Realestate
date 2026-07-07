'use client'

import { useState } from 'react'

type MediaItem = { name: string; url: string; size: number }

export default function MediaGrid({
  items,
  deleteMedia,
}: {
  items: MediaItem[]
  deleteMedia: (path: string) => Promise<void>
}) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  if (items.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-10">No media uploaded yet.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-32 object-cover bg-gray-50"
          />
          <div className="p-2 space-y-1.5">
            <p className="text-xs text-gray-500 truncate" title={item.name}>{item.name}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copy(item.url)}
                className="flex-1 text-xs font-medium text-brand-700 hover:text-brand-900 bg-brand-50 rounded px-2 py-1"
              >
                {copied === item.url ? 'Copied!' : 'Copy URL'}
              </button>
              <button
                onClick={() => { if (confirm('Delete this file?')) deleteMedia(item.name) }}
                className="text-xs font-medium text-danger-600 hover:text-danger-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
