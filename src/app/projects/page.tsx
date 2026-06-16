import type { Metadata } from 'next'
import { getAllProjects, getProjectCities } from '@/lib/queries'
import { PROJECT_TYPE_LABELS } from '@/types'
import ProjectCard from '@/components/ProjectCard'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'
import Breadcrumbs from '@/components/Breadcrumbs'
import { SlidersHorizontal } from 'lucide-react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'All Projects',
  description: 'Browse all ANON INDIA real estate projects. Plotted developments, apartments, villas & commercial. RERA approved.',
}

interface Props {
  searchParams: Promise<{ city?: string; type?: string; status?: string; category?: string; budget_max?: string }>
}

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

export default async function ProjectsPage({ searchParams }: Props) {
  const filters = await searchParams
  const [projects, cities] = await Promise.all([getAllProjects(filters), getProjectCities()])
  const hasFilters = !!(filters.city || filters.type || filters.status || filters.category || filters.budget_max)

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-brand-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">Our Projects</h1>
          <p className="text-gray-300">RERA-approved properties — find the one that fits.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={16} className="text-gray-500" />
                <p className="font-semibold text-brand-900">Filters</p>
              </div>
              <form method="GET" className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                  <select name="city" defaultValue={filters.city ?? ''} className={selectCls}>
                    <option value="">All Cities</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
                  <select name="type" defaultValue={filters.type ?? ''} className={selectCls}>
                    <option value="">All Types</option>
                    {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select name="category" defaultValue={filters.category ?? ''} className={selectCls}>
                    <option value="">All Categories</option>
                    {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Budget</label>
                  <select name="budget_max" defaultValue={filters.budget_max ?? ''} className={selectCls}>
                    <option value="">Any Budget</option>
                    {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select name="status" defaultValue={filters.status ?? ''} className={selectCls}>
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-gold-500 text-brand-900 text-sm font-semibold rounded-xl hover:bg-gold-600 hover:text-white transition-colors">
                  Apply Filters
                </button>
                {hasFilters && (
                  <a href="/projects" className="block text-center text-sm text-gray-400 hover:text-gray-600">Clear all</a>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-3">Need help choosing?</p>
                <LeadForm source="projects_page" compact title="" subtitle="" />
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-5">{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-400">No projects match your filters. <a href="/projects" className="text-gold-700 underline">Clear filters</a></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90}><ProjectCard project={p} /></Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
