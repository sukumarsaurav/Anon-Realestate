'use client'

import { useState } from 'react'
import { Quote, Star } from 'lucide-react'
import Avatar from '@/components/Avatar'
import type { Testimonial } from '@/types'

/* ─── Single card ─── */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="testimonial-card flex-shrink-0 w-[340px] sm:w-[380px] bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
      <Quote size={22} className="text-gold-400 mb-3" />
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-brand-900 overflow-hidden flex shrink-0">
            <Avatar name={t.client_name} src={t.photo_url} fontClass="text-xs" />
          </span>
          <div>
            <p className="font-semibold text-brand-900 text-sm">{t.client_name}</p>
            {t.project && <p className="text-xs text-gray-500">{t.project}</p>}
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={13} className="text-gold-500 fill-gold-500" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Single marquee row ─── */
function MarqueeRow({
  items,
  direction,
}: {
  items: Testimonial[]
  direction: 'left' | 'right'
}) {
  const [paused, setPaused] = useState(false)

  // Duplicate items to create seamless infinite loop
  const doubled = [...items, ...items]

  return (
    <div
      className="marquee-row overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`marquee-track flex gap-6 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
        style={{
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

/* ─── Main export ─── */
export default function TestimonialMarquee({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  // Split into two rows — at minimum we need 3 per row for a good visual
  const mid = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, mid)
  const row2 = testimonials.slice(mid)

  // If we have fewer than 2 total, fall back to nothing
  if (testimonials.length < 2) return null

  return (
    <div className="flex flex-col gap-6">
      <MarqueeRow items={row1} direction="left" />
      {row2.length > 0 && <MarqueeRow items={row2} direction="right" />}
    </div>
  )
}
