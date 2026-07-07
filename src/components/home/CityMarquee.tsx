'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { CityStat } from '@/types'

const CARD_WIDTH = 220
const GAP = 16
const STEP = CARD_WIDTH + GAP
const STEP_INTERVAL_MS = 2600
const TRANSITION_MS = 600

function CityCard({ c }: { c: CityStat }) {
  return (
    <Link
      href={`/projects?city=${encodeURIComponent(c.city)}`}
      className="group relative flex-shrink-0 w-[220px] h-44 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-soft"
    >
      <Image
        src={c.image} alt={`Real estate projects in ${c.city}`} fill sizes="220px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Bottom-up gradient so the label stays legible over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="font-serif font-semibold text-lg leading-tight drop-shadow-sm">{c.city}</p>
        <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
          View projects
          <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </p>
      </div>
    </Link>
  )
}

// Steps one card at a time (slide + pause) rather than a continuous scroll —
// sized so ~6 cards are visible at once on large screens, with the rest
// cycling through left-to-right over time instead of wrapping onto a
// second row.
export default function CityMarquee({ cities }: { cities: CityStat[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [instant, setInstant] = useState(false)
  const n = cities.length

  // Advance one card at a time; once we've stepped past the original set
  // (into the duplicated tail), snap back to 0 without animating so the
  // loop reads as seamless.
  useEffect(() => {
    if (n <= 6 || paused) return
    const id = setInterval(() => setIndex((i) => i + 1), STEP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [n, paused])

  useEffect(() => {
    if (index !== n) return
    const t = setTimeout(() => {
      setInstant(true)
      setIndex(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)))
    }, TRANSITION_MS)
    return () => clearTimeout(t)
  }, [index, n])

  // Fewer cities than fit on screen at once — a static row looks better than
  // a pointless "carousel" with barely any motion.
  if (n <= 6) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {cities.map((c) => <CityCard key={c.city} c={c} />)}
      </div>
    )
  }

  const doubled = [...cities, ...cities]

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-4"
        style={{
          transform: `translateX(-${index * STEP}px)`,
          transition: instant ? 'none' : `transform ${TRANSITION_MS}ms cubic-bezier(0.16,1,0.3,1)`,
        }}
      >
        {doubled.map((c, i) => <CityCard key={`${c.city}-${i}`} c={c} />)}
      </div>
    </div>
  )
}
