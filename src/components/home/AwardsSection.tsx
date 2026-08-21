'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Lightbox from '@/components/Lightbox'
import { AWARDS } from '@/data/awards'

export default function AwardsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 380, behavior: 'smooth' })
  }

  return (
    <>
      <section className="bg-brand-50 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Recognition</p>
            <h2 className="section-heading">
              Awards & <span className="accent-italic">Accolades</span>
            </h2>
            <p className="section-sub mx-auto">
              Trusted by top developers and recognized for excellence across India.
            </p>
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
              className="flex gap-6 overflow-x-auto pb-4 snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {AWARDS.map((award, index) => (
                <button
                  key={award.src}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative shrink-0 snap-start w-[340px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lift transition-shadow duration-300 text-left"
                >
                  {/* Image */}
                  <div className="relative w-full h-[260px] bg-gray-50 overflow-hidden">
                    <Image
                      src={award.src}
                      alt={award.title}
                      fill
                      sizes="340px"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1">
                      {award.org}
                    </p>
                    <p className="font-semibold text-brand-900 mb-1.5">{award.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {award.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/awards" className="text-sm font-semibold text-brand-900 hover:text-gold-700 transition-colors inline-flex items-center gap-1.5">
              See all recognition <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Lightbox
        slides={AWARDS.map((a) => ({ src: a.src, title: a.title, caption: `${a.org} — ${a.description}` }))}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  )
}
