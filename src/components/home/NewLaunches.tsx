'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, X, Sparkles } from 'lucide-react'
import type { Project } from '@/types'
import { formatINR } from '@/lib/format'
import { projectImage } from '@/lib/images'
import LeadForm from '@/components/LeadForm'

interface Props {
  projects: Project[]
}

export default function NewLaunches({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Sync index from manual scrolling
  const handleScroll = () => {
    if (!carouselRef.current) return
    const scrollLeft = carouselRef.current.scrollLeft
    const card = carouselRef.current.firstElementChild as HTMLElement
    if (!card) return
    const cardWidth = card.getBoundingClientRect().width + 20 // width + gap
    const index = Math.round(scrollLeft / cardWidth)
    if (index >= 0 && index < projects.length) {
      setActiveIndex(index)
    }
  }

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return
    const card = carouselRef.current.children[index] as HTMLElement
    if (card) {
      carouselRef.current.scrollTo({
        left: card.offsetLeft - 16, // offset padding
        behavior: 'smooth',
      })
      setActiveIndex(index)
    }
  }

  const handlePrev = () => {
    scrollToCard(Math.max(0, activeIndex - 1))
  }

  const handleNext = () => {
    scrollToCard(Math.min(projects.length - 1, activeIndex + 1))
  }

  // Parse BHK configurations into clean tags
  const getBhkTags = (bhkConfig: string | null) => {
    if (!bhkConfig) return ['Premium Units']
    return bhkConfig
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3)
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Fresh on the Market</p>
            <h2 className="text-4xl font-serif font-semibold text-brand-900 leading-tight">
              Exclusive <span className="text-gold-500 font-sans font-bold">New Launches</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl text-base leading-relaxed">
              As your trusted real estate advisor, we've hand-picked and verified these newly launched premier developments for your luxury living and sound investment.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-all"
              >
                <Sparkles size={16} /> Grab Your Deal
              </button>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-900 text-brand-900 font-semibold rounded-xl hover:bg-brand-900 hover:text-white transition-colors"
              >
                Explore All
              </Link>
            </div>
          </div>

          {/* Right Column: Mini Thumbnails Selector */}
          <div className="lg:col-span-5 w-full">
            <div className="flex items-center justify-start lg:justify-end gap-3 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {projects.map((p, idx) => {
                const img = projectImage(p, 150)
                const isActive = activeIndex === idx
                return (
                  <button
                    key={p.id}
                    onClick={() => scrollToCard(idx)}
                    className="flex flex-col items-center shrink-0 focus:outline-none"
                  >
                    <div
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-gold-500 scale-105 shadow-md shadow-gold/20'
                          : 'border-gray-200 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1.5 max-w-[70px] truncate text-center block transition-colors ${
                        isActive ? 'text-gold-700' : 'text-gray-500'
                      }`}
                    >
                      {p.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Featured Slider Area */}
        <div className="relative">
          {/* Nav Arrows */}
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous launches"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-card flex items-center justify-center text-brand-900 hover:bg-gold-500 hover:text-white disabled:opacity-0 transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex >= projects.length - 1}
            aria-label="Next launches"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-card flex items-center justify-center text-brand-900 hover:bg-gold-500 hover:text-white disabled:opacity-0 transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slider Container */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((p) => {
              const img = projectImage(p, 1200)
              const bhks = getBhkTags(p.bhk_config)
              const priceLabel = p.starting_price
                ? formatINR(p.starting_price)
                : p.price_per_sqft
                ? `₹${p.price_per_sqft.toLocaleString('en-IN')}/sq.ft.`
                : 'On Request'

              return (
                <div
                  key={p.id}
                  className="w-[88vw] sm:w-[65vw] lg:w-[calc(50%-10px)] shrink-0 snap-start relative aspect-[4/3] rounded-3xl overflow-hidden border border-gray-150 shadow-soft group"
                >
                  {/* Full image */}
                  <Image
                    src={img}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Backdrop overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/10 to-transparent" />

                  {/* Top-Left Red Launch Badge */}
                  <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg shadow-sm border border-red-500">
                    New Launch
                  </span>

                  {/* Overlapping Info Box */}
                  <div className="absolute bottom-5 left-5 w-[calc(100%-40px)] sm:w-[480px] bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-card border border-gray-100 flex flex-col justify-between z-10">
                    <div>
                      <h3 className="font-serif font-bold text-brand-900 text-lg sm:text-xl line-clamp-1">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 mb-3">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                          {[p.locality, p.city].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase">
                          Starting From
                        </p>
                        <p className="text-lg font-extrabold text-gold-700 tabular-nums-pro">
                          {priceLabel}
                        </p>
                      </div>

                      {/* BHK pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {bhks.map((b) => (
                          <span
                            key={b}
                            className="bg-gold-50/50 text-gold-700 border border-gold-200/50 text-[10px] font-semibold px-2 py-1 rounded-md"
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2.5 bg-gold-500 text-white text-xs font-semibold rounded-xl hover:bg-gold-600 transition-colors shrink-0"
                      >
                        Know More <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grab Your Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-brand-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Form Dialog */}
          <div className="relative bg-white rounded-2xl shadow-lift w-full max-w-md p-6 border border-gray-100 z-10 animate-fade-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <LeadForm
              source="new_launches_grab_deal"
              title="Claim Launch Deal"
              subtitle="Enter your details below to receive premium launching deals and priority allotments."
              onSuccess={() => {
                setTimeout(() => setShowModal(false), 2000)
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
