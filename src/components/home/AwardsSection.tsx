'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

const AWARDS = [
  {
    src: '/awards/jagran-swarnim-noida-trophy.jpeg',
    title: 'Swarnim Noida Award',
    org: 'Dainik Jagran',
    description: 'Acknowledged for valued support and association — Delhi-NCR, April 2026',
  },
  {
    src: '/awards/jagran-leaders-of-change.jpeg',
    title: 'Leaders of Change',
    org: 'Dainik Jagran',
    description: 'Outstanding contribution towards the growth and prosperity of Noida',
  },
  {
    src: '/awards/iris-broadway-rising-star.jpeg',
    title: 'Rising Star Award',
    org: 'IRIS Broadway, Greno West',
    description: 'In recognition of hard work, commitment, and dedication to professionalism',
  },
  {
    src: '/awards/sunteck-celebration-of-excellence.jpeg',
    title: 'Celebration of Excellence',
    org: 'Sunteck Beach Residences',
    description: 'Presented to ANON INDIA as a token of appreciation for valuable participation',
  },
  {
    src: '/awards/sunteck-beach-appreciation.jpeg',
    title: 'Token of Appreciation',
    org: 'Sunteck Beach Residences',
    description: 'Recognized for valuable participation in Sunteck\'s luxury beachfront project',
  },
  {
    src: '/awards/jagran-swarnim-noida-office.jpeg',
    title: 'Swarnim Noida Recognition',
    org: 'Dainik Jagran',
    description: 'Dual award display at the ANON INDIA headquarters — Delhi-NCR, April 2026',
  },
]

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
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            {/* Navigation arrows */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Previous award"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            {lightboxIndex < AWARDS.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Next award"
              >
                <ArrowRight size={20} />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white">
              <Image
                src={AWARDS[lightboxIndex].src}
                alt={AWARDS[lightboxIndex].title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain p-4"
                priority
              />
            </div>

            {/* Caption */}
            <div className="text-center mt-4">
              <p className="text-white font-semibold text-lg">{AWARDS[lightboxIndex].title}</p>
              <p className="text-white/60 text-sm mt-1">{AWARDS[lightboxIndex].org} — {AWARDS[lightboxIndex].description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
