'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Expand } from 'lucide-react'
import Lightbox from '@/components/Lightbox'
import type { EventPhoto } from '@/data/events'

/**
 * Photo wall for a single event. A two-column grid where portrait frames claim
 * two rows — which fills flush for both the three-shot and four-shot events,
 * with no ragged columns and no empty cells.
 */
export default function EventGallery({ photos, eventTitle }: { photos: EventPhoto[]; eventTitle: string }) {
  const [index, setIndex] = useState<number | null>(null)

  // Portraits lead: a two-row frame placed later would strand the cell beside
  // it, so hoisting them keeps auto-placement gap-free.
  const isPortrait = (p: EventPhoto) => p.height > p.width
  const ordered = [...photos].sort((a, b) => Number(isPortrait(b)) - Number(isPortrait(a)))

  return (
    <>
      <div className="grid grid-cols-2 auto-rows-[130px] sm:auto-rows-[180px] gap-3 sm:gap-4">
        {ordered.map((photo, i) => {
          const portrait = isPortrait(photo)
          return (
            <button
              key={photo.src}
              onClick={() => setIndex(i)}
              aria-label={`Open photo: ${photo.alt}`}
              className={`group relative overflow-hidden rounded-2xl bg-gray-100 ${portrait ? 'row-span-2' : ''}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                // Portrait shots sit high in frame so faces survive the crop.
                style={{ objectPosition: portrait ? '50% 35%' : '50% 50%' }}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-colors" />
              <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 text-brand-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand size={14} />
              </span>
            </button>
          )
        })}
      </div>

      <Lightbox
        slides={ordered.map((p) => ({ src: p.src, title: eventTitle, caption: p.alt }))}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  )
}
