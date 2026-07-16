'use client'

import { useRef, useState, useCallback } from 'react'
import { ArrowLeft, ArrowRight, Film } from 'lucide-react'

/**
 * Extract the reel shortcode from various Instagram URL formats:
 *   https://www.instagram.com/reel/DZ5jbaqyyIj/?igsh=...
 *   https://www.instagram.com/reel/DZ5jbaqyyIj/
 *   https://instagram.com/reel/DZ5jbaqyyIj
 */
function extractReelId(url: string): string | null {
  const match = url.match(/\/reel\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : null
}

const FALLBACK_INSTAGRAM_URL = 'https://instagram.com'

interface ReelsSectionProps {
  reels?: string[] | null
  instagramUrl?: string | null
}

export default function ReelsSection({ reels, instagramUrl }: ReelsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set())

  const scroll = useCallback((dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }, [])

  const markLoaded = useCallback((index: number) => {
    setLoadedSet((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  const instaUrl = instagramUrl || FALLBACK_INSTAGRAM_URL

  // Filter to valid reel URLs only
  const reelIds = (reels ?? [])
    .map((url) => ({ url, id: extractReelId(url) }))
    .filter((r): r is { url: string; id: string } => r.id !== null)

  if (reelIds.length === 0) return null

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-2">On the Gram</p>
            <h2 className="section-heading">
              ANON INDIA in <span className="accent-italic">reels</span>.
            </h2>
          </div>
          <a href={instaUrl} target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-brand-900 font-semibold rounded-full hover:bg-gold-600 hover:text-white transition-colors">
            <Film size={16} /> Follow us
          </a>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button onClick={() => scroll(-1)} aria-label="Previous"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-card items-center justify-center text-brand-900 hover:bg-gold-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          {/* Right Arrow */}
          <button onClick={() => scroll(1)} aria-label="Next"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-card items-center justify-center text-brand-900 hover:bg-gold-500 transition-colors">
            <ArrowRight size={18} />
          </button>

          <div ref={trackRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {reelIds.map(({ id }, index) => (
              <div key={id} className="relative shrink-0 snap-start w-[326px] h-[580px] rounded-3xl overflow-hidden bg-gray-100">
                {/* Loading skeleton */}
                {!loadedSet.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-3xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-200" />
                      <div className="w-24 h-3 rounded bg-gray-200" />
                      <div className="w-32 h-3 rounded bg-gray-200" />
                    </div>
                  </div>
                )}
                <iframe
                  src={`https://www.instagram.com/reel/${id}/embed/`}
                  width="326"
                  height="580"
                  frameBorder="0"
                  scrolling="no"
                  allow="encrypted-media"
                  title={`Instagram Reel ${id}`}
                  className="rounded-3xl border-0"
                  style={{ opacity: loadedSet.has(index) ? 1 : 0, transition: 'opacity 0.4s ease' }}
                  onLoad={() => markLoaded(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
