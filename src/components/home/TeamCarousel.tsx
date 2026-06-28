'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Avatar from '@/components/Avatar'
import type { TeamMember } from '@/types'

export default function TeamCarousel({ team }: { team: TeamMember[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  const goTo = (i: number) => {
    const idx = Math.max(0, Math.min(team.length - 1, i))
    setActive(idx)
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <div>
      {/* Big photo carousel */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {team.map((m, i) => (
            <div
              key={m.id}
              ref={(el) => { cardRefs.current[i] = el }}
              className="relative shrink-0 snap-start w-[78%] sm:w-[46%] lg:w-[calc(25%-12px)] aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-brand-900 ring-1 ring-black/5">
              <div className="absolute inset-0">
                <Avatar name={m.name} src={m.photo_url} fontClass="text-6xl" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-serif text-xl font-semibold text-gold-400 leading-tight drop-shadow">{m.name}</p>
                {m.designation && <p className="text-sm text-gray-200 mt-0.5">{m.designation}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button" onClick={() => goTo(active - 1)} disabled={active === 0}
          aria-label="Previous advisor"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-card flex items-center justify-center text-brand-900 hover:bg-white disabled:opacity-0 transition">
          <ChevronLeft size={20} />
        </button>
        <button
          type="button" onClick={() => goTo(active + 1)} disabled={active >= team.length - 1}
          aria-label="Next advisor"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-card flex items-center justify-center text-brand-900 hover:bg-white disabled:opacity-0 transition">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Selectable pill strip */}
      <div className="flex gap-3 overflow-x-auto mt-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {team.map((m, i) => (
          <button
            key={m.id} type="button" onClick={() => goTo(i)}
            aria-current={active === i}
            className={`flex items-center gap-2.5 shrink-0 pl-2 pr-4 py-2 rounded-full bg-white border transition-colors ${
              active === i ? 'border-gold-500 ring-1 ring-gold-500' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <span className="w-9 h-9 rounded-full bg-brand-900 overflow-hidden flex shrink-0">
              <Avatar name={m.name} src={m.photo_url} fontClass="text-xs" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-brand-900 whitespace-nowrap">{m.name}</span>
              {m.designation && <span className="block text-xs text-gray-500 whitespace-nowrap">{m.designation}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
