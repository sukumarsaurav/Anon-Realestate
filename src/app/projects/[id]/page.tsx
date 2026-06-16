import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjectIds } from '@/lib/queries'
import LeadForm from '@/components/LeadForm'
import EmiCalculator from '@/components/EmiCalculator'
import BrochureDownload from '@/components/BrochureDownload'
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from '@/types'
import { formatINR } from '@/lib/format'
import { projectImage, projectGallery } from '@/lib/images'
import Breadcrumbs from '@/components/Breadcrumbs'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com'
import { MapPin, Calendar, Home, Info, BedDouble, Building2, IndianRupee, LayoutGrid, ShieldCheck, TrendingUp, Sparkles, Navigation, HelpCircle, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { amenityIcon } from '@/lib/amenities'

interface Props {
  params: Promise<{ id: string }>
}

export const revalidate = 300

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
  const defaultPrice = project.starting_price ?? (priceRange ? Math.round((priceRange.min + priceRange.max) / 2) : 2000000)
  const heroImg = projectImage(project, 1200)
  const gallery = projectGallery(project, 6)

  const location = [project.locality, project.city].filter(Boolean).join(', ')
  const possession = project.expected_completion_date
    ? new Date(project.expected_completion_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  // "Why invest" highlights — curated USPs first (if the team has added any),
  // then highlights derived from verified project data (no invented claims).
  const investHighlights: { Icon: LucideIcon; t: string; s: string }[] = []
  for (const u of project.usp ?? []) investHighlights.push({ Icon: Sparkles, t: u, s: '' })
  if (project.rera_number) investHighlights.push({ Icon: ShieldCheck, t: 'RERA Registered', s: `Compliant & verified — ${project.rera_number}` })
  if (location) investHighlights.push({ Icon: MapPin, t: 'Prime Location', s: `Well-connected address in ${location}` })
  if (possession) investHighlights.push({ Icon: Calendar, t: 'Assured Possession', s: `Expected handover by ${possession}` })
  if (project.bhk_config) investHighlights.push({ Icon: BedDouble, t: 'Smart Configurations', s: `${project.bhk_config} options to choose from` })
  if (project.amenities?.length) investHighlights.push({ Icon: Sparkles, t: 'Lifestyle Amenities', s: `${project.amenities.length}+ curated amenities on offer` })
  investHighlights.push({ Icon: TrendingUp, t: 'Advisory-Backed', s: 'Vetted and supported by ANON INDIA advisors' })

  // FAQs — curated (if the team added any) override the auto-generated set.
  // Auto-generated FAQs are built from real fields; also emitted as FAQPage schema for SEO.
  const derivedFaqs: { q: string; a: string }[] = []
  if (location) derivedFaqs.push({ q: `Where is ${project.name} located?`, a: `${project.name} is located in ${location}.` })
  if (project.rera_number) derivedFaqs.push({ q: `Is ${project.name} RERA approved?`, a: `Yes. ${project.name} is registered under RERA number ${project.rera_number}${project.rera_registration_date ? `, registered on ${new Date(project.rera_registration_date).toLocaleDateString('en-IN')}` : ''}.` })
  if (project.bhk_config) derivedFaqs.push({ q: `What configurations are available at ${project.name}?`, a: `${project.name} offers ${project.bhk_config} configurations.` })
  if (project.starting_price) derivedFaqs.push({ q: `What is the starting price of ${project.name}?`, a: `Prices start from ${formatINR(project.starting_price)}. The final price sheet is shared after enquiry.` })
  if (possession) derivedFaqs.push({ q: `When is possession for ${project.name}?`, a: `Possession is expected by ${possession}.` })
  if (project.amenities?.length) derivedFaqs.push({ q: `What amenities does ${project.name} offer?`, a: `Key amenities include ${project.amenities.slice(0, 6).join(', ')}${project.amenities.length > 6 ? ' and more' : ''}.` })
  const faqs = project.faqs?.length ? project.faqs : derivedFaqs

  return (
    <div className="min-h-screen bg-cream">
      {/* Gallery hero */}
      <div className="bg-brand-900 h-64 md:h-80 lg:h-96 overflow-hidden relative">
        {heroImg ? (
          <Image src={heroImg} alt={project.name} fill priority sizes="100vw" className="object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Home size={64} className="text-gray-600" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-gold-500 text-brand-900">{PROJECT_STATUS_LABELS[project.status] ?? project.status}</span>
              {project.website_category && <span className="badge bg-white/15 text-white capitalize">{project.website_category}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
            <div className="flex items-center gap-4 text-gray-200 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{[project.locality, project.city].filter(Boolean).join(', ')}</span>
              {project.developer?.name && <span className="flex items-center gap-1.5"><Building2 size={14} />{project.developer.name}</span>}
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: project.name,
        description: project.description ?? `${PROJECT_TYPE_LABELS[project.type] ?? project.type} in ${project.city}`,
        image: [heroImg],
        brand: { '@type': 'Brand', name: 'ANON INDIA' },
        category: 'Real Estate',
        ...(project.starting_price ? {
          offers: {
            '@type': 'Offer', priceCurrency: 'INR', price: project.starting_price,
            availability: 'https://schema.org/InStock', url: `${SITE}/projects/${project.id}`,
          },
        } : {}),
      }) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: project.name }]} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { Icon: IndianRupee, label: 'Starting', value: formatINR(project.starting_price) },
                  { Icon: BedDouble, label: 'Config', value: project.bhk_config ?? '—' },
                  { Icon: Home, label: 'Type', value: PROJECT_TYPE_LABELS[project.type] ?? project.type },
                  { Icon: Calendar, label: 'Possession', value: project.expected_completion_date
                    ? new Date(project.expected_completion_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="text-center p-4 bg-cream rounded-xl">
                    <Icon size={16} className="text-gold-700 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-bold text-brand-900 text-sm">{value}</p>
                  </div>
                ))}
              </div>
              {project.price_per_sqft && (
                <p className="text-xs text-gray-500 mt-3 text-center">₹{project.price_per_sqft.toLocaleString('en-IN')} / sq.ft · final price sheet shared after enquiry</p>
              )}
            </div>

            {/* About */}
            {project.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-3">About the Project</h2>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Configurations & pricing (unit-level table from plots) */}
            {availablePlots.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="font-bold text-brand-900 text-lg flex items-center gap-2"><IndianRupee size={18} className="text-gold-700" /> Configurations &amp; Pricing</h2>
                  {priceRange && <span className="text-sm font-semibold text-gold-700">{formatINR(priceRange.min)} – {formatINR(priceRange.max)}</span>}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                        <th className="px-2 py-2 font-semibold">Unit</th>
                        <th className="px-2 py-2 font-semibold">Size</th>
                        <th className="px-2 py-2 font-semibold">Facing</th>
                        <th className="px-2 py-2 font-semibold text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availablePlots.slice(0, 8).map((p) => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-2 py-3 font-medium text-brand-900">{[p.type, p.plot_number].filter(Boolean).join(' ') || 'Unit'}</td>
                          <td className="px-2 py-3 text-gray-600">{p.size_sqft ? `${p.size_sqft.toLocaleString('en-IN')} sq.ft` : `${p.size_sqyd} sq.yd`}</td>
                          <td className="px-2 py-3 text-gray-600">{p.facing || '—'}</td>
                          <td className="px-2 py-3 text-right font-bold text-brand-900">{formatINR(p.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gold-700 mt-3 flex items-center gap-1"><Info size={11} /> {availablePlots.length} units available · final price sheet shared after enquiry</p>
              </div>
            )}

            {/* Floor plan / layout */}
            {project.layout_image_url && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-4 flex items-center gap-2"><LayoutGrid size={18} className="text-gold-700" /> Master Plan / Layout</h2>
                <a href={project.layout_image_url} target="_blank" rel="noopener noreferrer" className="relative block h-72 rounded-xl overflow-hidden bg-cream">
                  <Image src={project.layout_image_url} alt={`${project.name} layout`} fill sizes="(max-width:1024px) 100vw, 66vw" className="object-contain" />
                </a>
              </div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-4 flex items-center gap-2"><Sparkles size={18} className="text-gold-700" /> Amenities &amp; Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.amenities.map((a: string) => {
                    const Icon = amenityIcon(a)
                    return (
                      <div key={a} className="flex flex-col items-center text-center gap-2 p-4 bg-cream rounded-xl border border-gray-100">
                        <span className="w-11 h-11 rounded-full bg-gold-50 flex items-center justify-center">
                          <Icon size={20} className="text-gold-700" />
                        </span>
                        <span className="text-xs font-medium text-gray-700 leading-snug">{a}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Why invest */}
            {investHighlights.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-gold-700" /> Why Invest in {project.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {investHighlights.map(({ Icon, t, s }) => (
                    <div key={t} className="flex items-start gap-3 p-4 bg-cream rounded-xl">
                      <span className="w-9 h-9 rounded-lg bg-gold-50 flex items-center justify-center shrink-0"><Icon size={17} className="text-gold-700" /></span>
                      <div>
                        <p className="font-semibold text-brand-900 text-sm">{t}</p>
                        {s && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & connectivity */}
            {location && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-3 flex items-center gap-2"><Navigation size={18} className="text-gold-700" /> Location &amp; Connectivity</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {project.name} is situated in {location} — explore the neighbourhood and nearby connectivity on the map below.
                </p>
                {project.connectivity && project.connectivity.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {project.connectivity.map((c) => (
                      <div key={c.place} className="flex items-center justify-between gap-3 px-4 py-3 bg-cream rounded-xl text-sm">
                        <span className="flex items-center gap-2 text-gray-700"><MapPin size={14} className="text-gold-700 shrink-0" />{c.place}</span>
                        <span className="font-semibold text-brand-900 shrink-0">{c.distance}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-gray-100">
                  <iframe
                    title={`Map of ${project.name}, ${location}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                    loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full" />
                </div>
                {project.google_maps_pin && (
                  <a href={project.google_maps_pin} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-gold-700 hover:text-brand-900 transition-colors">
                    <MapPin size={14} /> Open exact location in Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.slice(0, 9).map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative block h-32 rounded-xl overflow-hidden">
                      <Image src={url} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* RERA */}
            {project.rera_number && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-3">RERA Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">RERA Number</p>
                    <p className="font-medium text-brand-900">{project.rera_number}</p>
                  </div>
                  {project.rera_registration_date && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><Calendar size={10} /> Registration Date</p>
                      <p className="font-medium text-brand-900">{new Date(project.rera_registration_date).toLocaleDateString('en-IN')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About the developer */}
            {project.developer?.name && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-4">About the Developer</h2>
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-xl bg-brand-900 flex items-center justify-center shrink-0"><Building2 size={22} className="text-gold-400" /></span>
                  <div>
                    <p className="font-bold text-brand-900">{project.developer.name}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {project.developer_about || `${project.developer.name} is among the trusted developers ANON INDIA partners with, delivering RERA-compliant, quality-led projects.`}
                    </p>
                    <Link href="/developers" className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-gold-700 hover:text-brand-900 transition-colors">
                      View the ANON Group <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-brand-900 text-lg mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-gold-700" /> Frequently Asked Questions</h2>
                <div className="divide-y divide-gray-100">
                  {faqs.map((f) => (
                    <details key={f.q} className="group py-3">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-medium text-brand-900 text-sm">
                        {f.q}
                        <ArrowRight size={15} className="shrink-0 text-gold-700 transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">{f.a}</p>
                    </details>
                  ))}
                </div>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
                }) }} />
              </div>
            )}

            {/* EMI */}
            <EmiCalculator defaultPrice={defaultPrice} />
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:sticky lg:top-24">
              <LeadForm
                projectId={project.id}
                projectName={project.name}
                source="project_detail"
                title={`Enquire about ${project.name}`}
                subtitle="Get pricing, availability, and a site visit in one call."
              />
              {project.brochure_url && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <BrochureDownload projectId={project.id} projectName={project.name} brochureUrl={project.brochure_url} />
                </div>
              )}
              {project.google_maps_pin && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href={project.google_maps_pin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gold-700 hover:text-brand-900 transition-colors font-medium">
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
