'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShieldCheck, Star, Users } from 'lucide-react'
import { PROJECT_TYPE_LABELS } from '@/types'

export default function HeroSearch({ cities }: { cities: string[] }) {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [type, setType] = useState('')

  const search = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    router.push(`/projects${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="relative bg-brand-900 text-white overflow-hidden">
      {/* Background image with slow ambient zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt="" fill priority sizes="100vw" className="object-cover opacity-25 animate-slow-zoom" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-900/40" />
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
          <div className="mt-8 bg-white rounded-2xl p-2.5 flex flex-col sm:flex-row gap-2 max-w-2xl shadow-xl">
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="">All Types</option>
              {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <button onClick={search}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-brand-900 font-semibold rounded-xl hover:bg-gold-600 hover:text-white transition-colors">
              <Search size={18} /> Search
            </button>
          </div>

          {/* Trust line */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-gold-400" /> RERA Approved</span>
            <span className="flex items-center gap-1.5"><Star size={15} className="text-gold-400 fill-gold-400" /> 4.9 Google rating</span>
            <span className="flex items-center gap-1.5"><Users size={15} className="text-gold-400" /> 1000+ happy families</span>
          </div>
        </div>
      </div>
    </section>
  )
}
