import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjectIds } from '@/lib/queries'
import LeadForm from '@/components/LeadForm'
import EmiCalculator from '@/components/EmiCalculator'
import BrochureDownload from '@/components/BrochureDownload'
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from '@/types'
import { MapPin, CheckCircle, Calendar, Home, Info } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export const revalidate = 300

// Pre-render each project page at build time; new/unknown ids render on demand.
export async function generateStaticParams() {
  const ids = await getAllProjectIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectBySlug(id)
  if (!project) return {}
  return {
    title: `${project.name} — ${project.city}`,
    description: project.description ?? `${PROJECT_TYPE_LABELS[project.type] ?? project.type} in ${project.city}. RERA: ${project.rera_number ?? 'Registered'}. Contact ANON INDIA for details.`,
    openGraph: { images: project.gallery_urls?.[0] ? [{ url: project.gallery_urls[0] }] : [] },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  const project = await getProjectBySlug(id)
  if (!project) notFound()

  const availablePlots = (project.plots ?? []).filter((p) => p.status === 'available')
  const priceRange = availablePlots.length > 0
    ? { min: Math.min(...availablePlots.map((p) => p.total_price)), max: Math.max(...availablePlots.map((p) => p.total_price)) }
    : null

  const defaultPrice = priceRange ? Math.round((priceRange.min + priceRange.max) / 2) : 2000000

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gallery hero */}
      <div className="bg-gray-900 h-64 md:h-80 lg:h-96 overflow-hidden relative">
        {project.gallery_urls?.length > 0 ? (
          <Image src={project.gallery_urls[0]} alt={project.name} fill priority
            sizes="100vw"
            className="object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={64} className="text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto">
          <span className="badge bg-blue-600 text-white mb-3">{PROJECT_STATUS_LABELS[project.status] ?? project.status}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
          <div className="flex items-center gap-2 text-gray-200 mt-1">
            <MapPin size={14} />
            <span>{[project.locality, project.city].filter(Boolean).join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Type',        value: PROJECT_TYPE_LABELS[project.type] ?? project.type },
                  { label: 'Total Units', value: project.total_units ? String(project.total_units) : '—' },
                  { label: 'Available',   value: availablePlots.length > 0 ? `${availablePlots.length} plots` : 'Enquire' },
                  { label: 'Possession',  value: project.expected_completion_date
                    ? new Date(project.expected_completion_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-3">About the Project</h2>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Price range */}
            {priceRange && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-1">Price Range</h2>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{(priceRange.min / 100000).toFixed(0)}L — ₹{(priceRange.max / 100000).toFixed(0)}L
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {availablePlots.length} plots available · Prices may vary by plot facing and size
                </p>
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Info size={11} /> Final price sheet shared after enquiry
                </p>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {project.gallery_urls?.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.gallery_urls.slice(0, 9).map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="relative block h-32 rounded-xl overflow-hidden">
                      <Image src={url} alt={`Gallery ${i + 1}`} fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* RERA */}
            {project.rera_number && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-3">RERA Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">RERA Number</p>
                    <p className="font-medium text-gray-900">{project.rera_number}</p>
                  </div>
                  {project.rera_registration_date && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><Calendar size={10} /> Registration Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(project.rera_registration_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EMI Calculator */}
            <EmiCalculator defaultPrice={defaultPrice} />
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Lead form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:sticky lg:top-24">
              <LeadForm
                projectId={project.id}
                projectName={project.name}
                source="project_detail"
                title={`Enquire about ${project.name}`}
                subtitle="Get pricing, availability, and site visit in one call."
              />

              {/* Brochure download */}
              {project.brochure_url && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <BrochureDownload
                    projectId={project.id}
                    projectName={project.name}
                    brochureUrl={project.brochure_url}
                  />
                </div>
              )}

              {/* Map */}
              {project.google_maps_pin && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href={project.google_maps_pin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <MapPin size={14} /> View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
