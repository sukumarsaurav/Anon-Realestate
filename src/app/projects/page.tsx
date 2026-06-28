import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllProjects, getProjectCities } from '@/lib/queries'
import Breadcrumbs from '@/components/Breadcrumbs'
import PageHero from '@/components/PageHero'
import ProjectsBrowser from '@/components/ProjectsBrowser'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'All Projects',
  description: 'Browse all ANON INDIA real estate projects. Plotted developments, apartments, villas & commercial. RERA approved.',
}

export default async function ProjectsPage() {
  // Fetch the full active list once (cached); filtering happens client-side so
  // this page stays static HTML instead of re-rendering per request.
  const [projects, cities] = await Promise.all([getAllProjects(), getProjectCities()])

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <PageHero
        eyebrow="Our portfolio"
        title="Our Projects"
        subtitle="RERA-approved properties — find the one that fits."
        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={null}>
          <ProjectsBrowser projects={projects} cities={cities} />
        </Suspense>
      </div>
    </div>
  )
}
