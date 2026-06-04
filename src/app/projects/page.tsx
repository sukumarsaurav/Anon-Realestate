import type { Metadata } from 'next'
import { getAllProjects, getProjectCities } from '@/lib/queries'
import ProjectCard from '@/components/ProjectCard'
import LeadForm from '@/components/LeadForm'
import { SlidersHorizontal } from 'lucide-react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'All Projects',
  description: 'Browse all ANON INDIA real estate projects across Rajasthan. Plotted developments, apartments, and villas. RERA approved.',
}

interface Props {
  searchParams: Promise<{ city?: string; type?: string; status?: string }>
}

export default async function ProjectsPage({ searchParams }: Props) {
  const filters = await searchParams
  const [projects, cities] = await Promise.all([
    getAllProjects(filters),
    getProjectCities(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Our Projects</h1>
          <p className="text-blue-200">Discover premium real estate across Rajasthan</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={16} className="text-gray-500" />
                <p className="font-semibold text-gray-900">Filters</p>
              </div>
              <form method="GET" className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                  <select name="city" defaultValue={filters.city ?? ''}
                    className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Cities</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
                  <select name="type" defaultValue={filters.type ?? ''}
                    className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Types</option>
                    <option value="plotted">Plotted Development</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select name="status" defaultValue={filters.status ?? ''}
                    className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="pre_launch">Pre-Launch</option>
                    <option value="under_construction">Under Construction</option>
                    <option value="ready_to_move">Ready to Move</option>
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
                  Apply Filters
                </button>
                {(filters.city || filters.type || filters.status) && (
                  <a href="/projects"
                    className="block text-center text-sm text-gray-400 hover:text-gray-600">
                    Clear all
                  </a>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-3">Need help choosing?</p>
                <LeadForm source="projects_page" compact title="" subtitle="" />
              </div>
            </div>
          </aside>

          {/* Project grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {projects.length} project{projects.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-400">No projects match your filters. <a href="/projects" className="text-blue-600 underline">Clear filters</a></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
