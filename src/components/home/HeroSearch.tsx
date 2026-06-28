'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShieldCheck, Star, Users, MapPin, Home, Wallet } from 'lucide-react'
import { PROJECT_TYPE_LABELS } from '@/types'

const BUDGETS = [
  { value: '5000000', label: 'Under ₹50 L' },
  { value: '10000000', label: 'Under ₹1 Cr' },
  { value: '20000000', label: 'Under ₹2 Cr' },
  { value: '50000000', label: 'Under ₹5 Cr' },
]

export default function HeroSearch({ cities }: { cities: string[] }) {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')

  const search = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    if (budget) params.set('budget_max', budget)
    router.push(`/projects${params.toString() ? `?${params}` : ''}`)
  }

  const selectCls =
    'w-full appearance-none bg-white/5 text-white rounded-xl border border-white/15 px-3.5 py-3 text-sm ' +
    'hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent ' +
    'transition-colors [&>option]:text-brand-900'

  return (
    <section className="relative isolate bg-brand-900 text-white overflow-hidden">
      {/* Background image with slow ambient zoom */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt="" fill priority sizes="100vw" className="object-cover opacity-40 motion-safe:animate-slow-zoom" />
      </div>
      {/* Layered cinematic scrims — directional for legibility + bottom fade-out */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900 via-transparent to-brand-900/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-3xl motion-safe:animate-fade-up">
          <p className="eyebrow text-gold-400 mb-5">
            Best Real Estate Consultant in India
          </p>
          <h1 className="font-display text-display font-extrabold leading-[1.02] tracking-[-0.03em]">
            Find your next <span className="text-gold-400">premium property</span> with expert guidance.
          </h1>
          {/* Gold hairline accent */}
          <div className="h-px w-20 bg-gold-400/80 mt-7" />
          <p className="text-gray-300 text-lg leading-relaxed mt-7 max-w-2xl">
            RERA-approved projects, transparent pricing, and end-to-end advisory — structures, spaces &amp; solutions engineered by Anon.
          </p>

          {/* Search — glass treatment so it sits inside the cinematic hero */}
          <div className="mt-9 max-w-3xl rounded-2xl bg-white/[0.07] backdrop-blur-xl ring-1 ring-white/15 p-2.5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="block">
                <span className="flex items-center gap-1.5 px-1 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/90">
                  <MapPin size={12} /> Location
                </span>
                <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" className={selectCls}>
                  <option value="">All Cities</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="flex items-center gap-1.5 px-1 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/90">
                  <Home size={12} /> Property Type
                </span>
                <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type" className={selectCls}>
                  <option value="">All Types</option>
                  {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="flex items-center gap-1.5 px-1 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/90">
                  <Wallet size={12} /> Budget
                </span>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Budget" className={selectCls}>
                  <option value="">Any Budget</option>
                  {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>
            </div>
            <button onClick={search}
              className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gold-500 text-brand-900 font-semibold rounded-xl hover:bg-gold-600 transition-all hover:shadow-gold">
              <Search size={18} /> Search Properties
            </button>
          </div>

          {/* Trust line */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-gold-400" /> RERA Approved</span>
            <span className="flex items-center gap-1.5"><Star size={15} className="text-gold-400 fill-gold-400" /> Transparent pricing</span>
            <span className="flex items-center gap-1.5"><Users size={15} className="text-gold-400" /> End-to-end advisory</span>
          </div>
        </div>
      </div>
    </section>
  )
}
