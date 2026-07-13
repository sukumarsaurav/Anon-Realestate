'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Play, ArrowLeft, ArrowRight, Film } from 'lucide-react'

const FALLBACK_REELS: { image_url: string; caption: string; link?: string }[] = [
  { image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', caption: 'Anon Greens — site visit' },
  { image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', caption: 'Jaipur project tour' },
  { image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', caption: 'Inside a premium 3BHK' },
  { image_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600', caption: 'Plot handover day' },
  { image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', caption: 'Township aerial tour' },
  { image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600', caption: 'Happy homeowner story' },
]

const FALLBACK_INSTAGRAM_URL = 'https://instagram.com'

interface ReelsSectionProps {
  reels?: { image_url: string; caption: string; link?: string }[] | null
  instagramUrl?: string | null
}

export default function ReelsSection({ reels, instagramUrl }: ReelsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  const reelsList = reels && reels.length > 0 ? reels : FALLBACK_REELS
  const instaUrl = instagramUrl || FALLBACK_INSTAGRAM_URL

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
          {/* Arrows */}
          <button onClick={() => scroll(-1)} aria-label="Previous"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-card items-center justify-center text-brand-900 hover:bg-gold-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Next"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-card items-center justify-center text-brand-900 hover:bg-gold-500 transition-colors">
            <ArrowRight size={18} />
          </button>

          <div ref={trackRef} className="flex gap-5 overflow-x-auto pb-4 snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {reelsList.map((r, index) => (
              <a key={index} href={r.link || instaUrl} target="_blank" rel="noopener noreferrer"
                className="group relative shrink-0 snap-start w-[260px] h-[420px] rounded-3xl overflow-hidden bg-brand-900">
                <Image src={r.image_url} alt={r.caption} fill sizes="260px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/10 to-transparent" />
                {/* Play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-brand-900 transition-transform duration-300 group-hover:scale-110">
                    <Play size={24} className="ml-1 fill-brand-900" />
                  </span>
                </div>
                <p className="absolute bottom-4 left-4 right-4 text-white font-medium text-sm drop-shadow">{r.caption}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
