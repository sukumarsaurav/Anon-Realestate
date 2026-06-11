'use client'

import { useState } from 'react'
import type { Project } from '@/types'
import ProjectCard from '@/components/ProjectCard'

const TABS = [
  { value: 'all', label: 'All Properties' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
]

export default function PremiumProjects({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState('all')
  const filtered = tab === 'all' ? projects : projects.filter((p) => p.website_category === tab)

  return (
    <section className="bg-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="section-heading">Premium Properties</h2>
          <p className="section-sub mx-auto">Hand-picked projects across categories, vetted by our advisory team.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 mb-8">
          {TABS.map((t) => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                tab === t.value
                  ? 'bg-brand-900 text-white border-brand-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gold-400'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No properties in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}
