'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Expand } from 'lucide-react'
import Lightbox from '@/components/Lightbox'
import { AWARDS } from '@/data/awards'

/** Grid of the real award photographs, each opening in the shared lightbox. */
export default function AwardsGrid() {
  const [index, setIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AWARDS.map((award, i) => (
          <button
            key={award.src}
            onClick={() => setIndex(i)}
            className="group text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lift hover:border-gold-200 transition-all duration-300"
          >
            <div className="relative w-full h-[280px] bg-gradient-to-b from-gray-50 to-white overflow-hidden">
              <Image
                src={award.src}
                alt={award.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-brand-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand size={14} />
              </span>
            </div>
            <div className="p-5 border-t border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">{award.org}</p>
                <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded tabular-nums-pro">
                  {award.year}
                </span>
              </div>
              <p className="h-block text-lg">{award.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed mt-1.5">{award.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        slides={AWARDS.map((a) => ({ src: a.src, title: a.title, caption: `${a.org} — ${a.description}` }))}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  )
}
