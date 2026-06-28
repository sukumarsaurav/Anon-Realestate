'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { PROJECT_TYPE_LABELS } from '@/types'
import type { Project } from '@/types'
import ProjectCard from '@/components/ProjectCard'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'

const BUDGET_OPTIONS = [
  { value: '5000000', label: 'Under ₹50 L' },
  { value: '10000000', label: 'Under ₹1 Cr' },
  { value: '20000000', label: 'Under ₹2 Cr' },
  { value: '50000000', label: 'Under ₹5 Cr' },
]
const STATUS_OPTIONS = [
  { value: 'pre_launch', label: 'Pre-Launch' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready to Move' },
]
const CATEGORY_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'commercial', label: 'Commercial' },
]

const selectCls =
  'w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-400'

/**
 * Client-side filtering over the full (statically prerendered) project list.
 * Filters are mirrored to the URL so links stay shareable, but no server
 * round-trip happens — the page itself is static HTML served from the CDN.
 */
export default function ProjectsBrowser({ projects, cities }: { projects: Project[]; cities: string[] }) {
  const sp = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const city       = sp.get('city') ?? ''
  const type       = sp.get('type') ?? ''
  const category   = sp.get('category') ?? ''
  const budget_max = sp.get('budget_max') ?? ''
  const status     = sp.get('status') ?? ''
  const hasFilters = !!(city || type || category || budget_max || status)

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!city || p.city === city) &&
          (!type || p.type === type) &&
          (!status || p.status === status) &&
          (!category || p.website_category === category) &&
          (!budget_max || (p.starting_price != null && p.starting_price <= Number(budget_max))),
      ),
    [projects, city, type, status, category, budget_max],
  )

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters */}
      <aside className="lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={16} className="text-gray-500" />
            <p className="font-semibold text-brand-900">Filters</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <select value={city} onChange={(e) => setParam('city', e.target.value)} className={selectCls}>
                <option value="">All Cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
              <select value={type} onChange={(e) => setParam('type', e.target.value)} className={selectCls}>
                <option value="">All Types</option>
                {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={category} onChange={(e) => setParam('category', e.target.value)} className={selectCls}>
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Budget</label>
              <select value={budget_max} onChange={(e) => setParam('budget_max', e.target.value)} className={selectCls}>
                <option value="">Any Budget</option>
                {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={status} onChange={(e) => setParam('status', e.target.value)} className={selectCls}>
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button onClick={() => router.replace(pathname, { scroll: false })}
                className="block w-full text-center text-sm text-gray-500 hover:text-gray-600">
                Clear all
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-3">Need help choosing?</p>
            <LeadForm source="projects_page" compact title="" subtitle="" />
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-5">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500">
              No projects match your filters.{' '}
              <button onClick={() => router.replace(pathname, { scroll: false })} className="text-gold-700 underline">Clear filters</button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90} className="h-full"><ProjectCard project={p} /></Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
