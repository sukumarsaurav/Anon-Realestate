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
import Reveal from '@/components/Reveal'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anonindia.com'
import { MapPin, Calendar, Home, Info, BedDouble, Building2, IndianRupee, LayoutGrid, ShieldCheck, TrendingUp, Sparkles, Navigation, HelpCircle, ArrowRight, Phone } from 'lucide-react'
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

  const possessionShort = project.expected_completion_date
    ? new Date(project.expected_completion_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-cream">
      {/* ───────── Structured Data ───────── */}
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

      {/* ───────── Breadcrumbs ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: project.name }]} />
      </div>

      {/* ───────── IMMERSIVE SPLIT HERO ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Left — Hero Image (3/5 on desktop) */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden bg-brand-900 min-h-[20rem] md:min-h-[24rem] lg:min-h-[28rem]">
            {heroImg ? (
              <Image src={heroImg} alt={project.name} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Home size={64} className="text-gray-600" /></div>
            )}
            {/* Subtle bottom gradient for image anchoring */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
            {/* Badges floating on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="badge bg-gold-500 text-white shadow-soft">{PROJECT_STATUS_LABELS[project.status] ?? project.status}</span>
              {project.website_category && <span className="badge bg-white/90 text-brand-900 capitalize shadow-soft">{project.website_category}</span>}
            </div>
          </div>

          {/* Right — Property Summary Card (2/5 on desktop) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-6 lg:p-8 flex flex-col">
            {/* Project name & location */}
            <div className="mb-5">
              <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-brand-900 leading-tight">{project.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">
                <MapPin size={14} className="text-gold-700 shrink-0" />
                <span>{[project.locality, project.city].filter(Boolean).join(', ')}</span>
              </div>
              {project.developer?.name && (
                <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
                  <Building2 size={14} className="text-gold-700 shrink-0" />
                  <span>by {project.developer.name}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-5" />

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Config</p>
                <p className="font-semibold text-brand-900 text-sm">{project.bhk_config ?? '—'}</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="font-semibold text-brand-900 text-sm">{PROJECT_TYPE_LABELS[project.type] ?? project.type}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Possession</p>
                <p className="font-semibold text-brand-900 text-sm">{possessionShort ?? '—'}</p>
              </div>
            </div>

            {/* Hero Price */}
            <div className="bg-cream rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-500 mb-1">Starting from</p>
              <p className="font-serif text-2xl lg:text-3xl font-semibold text-brand-900 tabular-nums-pro">{formatINR(project.starting_price)}</p>
              {project.price_per_sqft && (
                <p className="text-xs text-gray-500 mt-1">₹{project.price_per_sqft.toLocaleString('en-IN')} / sq.ft</p>
              )}
            </div>

            {/* Spacer pushes CTA to bottom on desktop */}
            <div className="flex-1" />

            {/* Compact CTA in hero */}
            <div>
              <LeadForm
                projectId={project.id}
                projectName={project.name}
                source="project_detail_hero"
                title={`Enquire about ${project.name}`}
                subtitle="Get pricing, availability & site visit."
                compact={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───────── QUICK-GLANCE STRIP ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-center md:justify-between">
            {[
              { Icon: MapPin, label: 'Location', value: [project.locality, project.city].filter(Boolean).join(', ') || '—' },
              { Icon: Home, label: 'Property Type', value: PROJECT_TYPE_LABELS[project.type] ?? project.type },
              { Icon: IndianRupee, label: 'Price', value: formatINR(project.starting_price) },
              { Icon: BedDouble, label: 'Config', value: project.bhk_config ?? '—' },
              { Icon: Calendar, label: 'Possession', value: possessionShort ?? '—' },
              ...(project.rera_number ? [{ Icon: ShieldCheck, label: 'RERA', value: 'Registered ✓' }] : []),
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gold-700" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium leading-none mb-0.5">{label}</p>
                  <p className="font-semibold text-brand-900 text-sm truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── MAIN CONTENT + SIDEBAR ───────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ═══════ MAIN COLUMN (2/3) ═══════ */}
          <div className="lg:col-span-2 space-y-8">

            {/* ──── 1. About the Project ──── */}
            {project.description && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:p-8">
                  <h2 className="h-block mb-4">About the Project</h2>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              </Reveal>
            )}

            {/* ──── 2. Why Invest (cream background) ──── */}
            {investHighlights.length > 0 && (
              <Reveal>
                <div className="bg-cream rounded-2xl p-6 lg:p-8">
                  <h2 className="h-block mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-gold-700" /> Why Invest in {project.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {investHighlights.map(({ Icon, t, s }) => (
                      <div key={t} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-soft border border-gray-50">
                        <span className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0"><Icon size={18} className="text-gold-700" /></span>
                        <div>
                          <p className="font-semibold text-brand-900 text-sm">{t}</p>
                          {s && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* ──── 3. Configurations & Pricing ──── */}
            {availablePlots.length > 0 && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <h2 className="h-block flex items-center gap-2"><IndianRupee size={18} className="text-gold-700" /> Configurations &amp; Pricing</h2>
                    {priceRange && <span className="text-sm font-semibold text-gold-700">{formatINR(priceRange.min)} – {formatINR(priceRange.max)}</span>}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[480px]">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                          <th className="px-3 py-3 font-semibold">Unit</th>
                          <th className="px-3 py-3 font-semibold">Size</th>
                          <th className="px-3 py-3 font-semibold">Facing</th>
                          <th className="px-3 py-3 font-semibold text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availablePlots.slice(0, 8).map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-cream/50 transition-colors">
                            <td className="px-3 py-3.5 font-medium text-brand-900">{[p.type, p.plot_number].filter(Boolean).join(' ') || 'Unit'}</td>
                            <td className="px-3 py-3.5 text-gray-600">{p.size_sqft ? `${p.size_sqft.toLocaleString('en-IN')} sq.ft` : `${p.size_sqyd} sq.yd`}</td>
                            <td className="px-3 py-3.5 text-gray-600">{p.facing || '—'}</td>
                            <td className="px-3 py-3.5 text-right font-bold text-brand-900">{formatINR(p.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gold-700 mt-4 flex items-center gap-1"><Info size={11} /> {availablePlots.length} units available · final price sheet shared after enquiry</p>
                </div>
              </Reveal>
            )}

            {/* ──── 4. Master Plan / Layout ──── */}
            {project.layout_image_url && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:p-8">
                  <h2 className="h-block mb-5 flex items-center gap-2"><LayoutGrid size={18} className="text-gold-700" /> Master Plan / Layout</h2>
                  <a href={project.layout_image_url} target="_blank" rel="noopener noreferrer" className="relative block h-72 md:h-80 rounded-xl overflow-hidden bg-cream hover:opacity-90 transition-opacity">
                    <Image src={project.layout_image_url} alt={`${project.name} layout`} fill sizes="(max-width:1024px) 100vw, 66vw" className="object-contain" />
                  </a>
                </div>
              </Reveal>
            )}

            {/* ──── 5. Amenities (cream background) ──── */}
            {project.amenities && project.amenities.length > 0 && (
              <Reveal>
                <div className="bg-cream rounded-2xl p-6 lg:p-8">
                  <h2 className="h-block mb-5 flex items-center gap-2"><Sparkles size={18} className="text-gold-700" /> Amenities &amp; Features</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {project.amenities.map((a: string) => {
                      const Icon = amenityIcon(a)
                      return (
                        <div key={a} className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-xl shadow-soft border border-gray-50">
                          <span className="w-11 h-11 rounded-full bg-gold-50 flex items-center justify-center">
                            <Icon size={20} className="text-gold-700" />
                          </span>
                          <span className="text-xs font-medium text-gray-700 leading-snug">{a}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            )}

            {/* ──── 6. EMI Calculator (moved up) ──── */}
            <Reveal>
              <EmiCalculator defaultPrice={defaultPrice} />
            </Reveal>

            {/* ──── 7. Gallery (no card wrapper — images breathe) ──── */}
            {gallery.length > 0 && (
              <Reveal>
                <div>
                  <h2 className="h-block mb-5">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.slice(0, 9).map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="relative block h-36 md:h-44 rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-shadow group">
                        <Image src={url} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* ──── 8. Location & Connectivity ──── */}
            {location && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:p-8">
                  <h2 className="h-block mb-4 flex items-center gap-2"><Navigation size={18} className="text-gold-700" /> Location &amp; Connectivity</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    {project.name} is situated in {location} — explore the neighbourhood and nearby connectivity on the map below.
                  </p>
                  {project.connectivity && project.connectivity.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
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
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-gold-700 hover:text-brand-900 transition-colors">
                      <MapPin size={14} /> Open exact location in Google Maps
                    </a>
                  )}
                </div>
              </Reveal>
            )}

            {/* ──── 9. RERA + Developer — Combined Dark Trust Section ──── */}
            {(project.rera_number || project.developer?.name) && (
              <Reveal>
                <div className="bg-brand-900 rounded-2xl p-6 lg:p-8">
                  <div className={`grid grid-cols-1 ${project.rera_number && project.developer?.name ? 'md:grid-cols-2' : ''} gap-6`}>
                    {/* RERA */}
                    {project.rera_number && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                            <ShieldCheck size={20} className="text-gold-400" />
                          </span>
                          <h2 className="font-serif text-lg font-semibold text-white">RERA Details</h2>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">RERA Number</p>
                            <p className="font-medium text-white text-sm">{project.rera_number}</p>
                          </div>
                          {project.rera_registration_date && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar size={10} /> Registration Date</p>
                              <p className="font-medium text-white text-sm">{new Date(project.rera_registration_date).toLocaleDateString('en-IN')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Divider (visible only when both present on desktop) */}
                    {project.rera_number && project.developer?.name && (
                      <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-white/10" style={{ display: 'none' }} />
                    )}

                    {/* Developer */}
                    {project.developer?.name && (
                      <div className={project.rera_number ? 'md:border-l md:border-white/10 md:pl-6' : ''}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                            <Building2 size={20} className="text-gold-400" />
                          </span>
                          <h2 className="font-serif text-lg font-semibold text-white">About the Developer</h2>
                        </div>
                        <p className="font-serif font-semibold text-gold-400 text-sm">{project.developer.name}</p>
                        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                          {project.developer_about || `${project.developer.name} is among the trusted developers ANON INDIA partners with, delivering RERA-compliant, quality-led projects.`}
                        </p>
                        <Link href="/developers" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors">
                          View the ANON Group <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {/* ──── 10. FAQs ──── */}
            {faqs.length > 0 && (
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 lg:p-8">
                  <h2 className="h-block mb-5 flex items-center gap-2"><HelpCircle size={18} className="text-gold-700" /> Frequently Asked Questions</h2>
                  <div className="divide-y divide-gray-100">
                    {faqs.map((f) => (
                      <details key={f.q} className="group py-3.5">
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
              </Reveal>
            )}

          </div>

          {/* ═══════ SIDEBAR (1/3) ═══════ */}
          <div className="lg:col-span-1 space-y-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Lead Form Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <LeadForm
                  projectId={project.id}
                  projectName={project.name}
                  source="project_detail"
                  title={`Enquire about ${project.name}`}
                  subtitle="Get pricing, availability, and a site visit in one call."
                />
              </div>

              {/* Brochure + Maps */}
              {(project.brochure_url || project.google_maps_pin) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 space-y-4">
                  {project.brochure_url && (
                    <BrochureDownload projectId={project.id} projectName={project.name} brochureUrl={project.brochure_url} />
                  )}
                  {project.brochure_url && project.google_maps_pin && (
                    <div className="border-t border-gray-100" />
                  )}
                  {project.google_maps_pin && (
                    <a href={project.google_maps_pin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gold-700 hover:text-brand-900 transition-colors font-medium">
                      <MapPin size={14} /> View on Google Maps
                    </a>
                  )}
                </div>
              )}

              {/* Quick contact mini-card */}
              <div className="bg-brand-900 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-300 mb-2">Need help deciding?</p>
                <p className="font-serif font-semibold text-white text-lg mb-3">Talk to an Advisor</p>
                <a href="tel:+919876543210" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors text-sm">
                  <Phone size={16} /> Call Now
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
