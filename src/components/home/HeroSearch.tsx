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

  return (
    <section className="relative bg-brand-900 text-white overflow-hidden">
      {/* Background image with slow ambient zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt="" fill priority sizes="100vw" className="object-cover opacity-45 motion-safe:animate-slow-zoom" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/70 to-brand-900/25" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="inline-block text-xs font-semibold tracking-widest text-gold-400 uppercase mb-4">
            Best Real Estate Consultant in India
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.08] tracking-tight">
            Find your next <span className="italic text-gold-400">premium property</span> with expert guidance.
          </h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            RERA-approved projects, transparent pricing, and end-to-end advisory — structures, spaces &amp; solutions engineered by Anon.
          </p>

          {/* Search */}
          <div className="mt-8 bg-white rounded-2xl p-3 sm:p-2.5 max-w-3xl shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="block">
                <span className="flex items-center gap-1 px-1 mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <MapPin size={12} /> Location
                </span>
                <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City"
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value="">All Cities</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="flex items-center gap-1 px-1 mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <Home size={12} /> Property Type
                </span>
                <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type"
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value="">All Types</option>
                  {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="flex items-center gap-1 px-1 mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <Wallet size={12} /> Budget
                </span>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} aria-label="Budget"
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value="">Any Budget</option>
                  {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>
            </div>
            <button onClick={search}
              className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gold-500 text-brand-900 font-semibold rounded-xl hover:bg-gold-600 hover:text-white transition-colors">
              <Search size={18} /> Search Properties
            </button>
          </div>

          {/* Trust line */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-gold-400" /> RERA Approved</span>
            <span className="flex items-center gap-1.5"><Star size={15} className="text-gold-400 fill-gold-400" /> Transparent pricing</span>
            <span className="flex items-center gap-1.5"><Users size={15} className="text-gold-400" /> End-to-end advisory</span>
          </div>
        </div>
      </div>
    </section>
  )
}
