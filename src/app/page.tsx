import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProjects, getActiveTestimonials } from '@/lib/queries'
import LeadForm from '@/components/LeadForm'
import ProjectCard from '@/components/ProjectCard'
import { CheckCircle, Award, Users, MapPin, Star, ArrowRight, Building2 } from 'lucide-react'

// Revalidate at most every 5 minutes — content changes rarely, so serve
// statically generated HTML instead of re-querying Supabase on every request.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'ANON INDIA — Premium Real Estate in Rajasthan',
  description: 'Trusted plotted development and real estate projects in Jaipur and Rajasthan. RERA approved. 1000+ happy families. Get a free callback today.',
}

const TRUST_STATS = [
  { value: '15+', label: 'Years Experience',   icon: Award },
  { value: '50+', label: 'Projects Delivered', icon: Building2 },
  { value: '1000+', label: 'Happy Families',   icon: Users },
  { value: '8',   label: 'Cities Covered',     icon: MapPin },
]

export default async function HomePage() {
  const [projects, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getActiveTestimonials(),
  ])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-700/50 text-blue-200 text-sm font-medium rounded-full mb-5">
                🏆 Rajasthan&apos;s Trusted Real Estate Developer
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5">
                Find Your Dream <span className="text-blue-300">Property</span> in Rajasthan
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Premium plotted developments and residential projects. RERA approved, transparent pricing, and lifetime support. Trusted by 1000+ families across Rajasthan.
              </p>
              <div className="flex flex-wrap gap-3">
                {['RERA Approved', 'Clear Titles', 'EMI Available', 'On-time Delivery'].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-sm">
                    <CheckCircle size={13} className="text-green-400" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Lead form card */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <LeadForm
                source="homepage_hero"
                title="Get a Free Callback"
                subtitle="Talk to an expert advisor within 30 minutes."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {TRUST_STATS.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Our Projects</p>
              <h2 className="section-heading">Featured Developments</h2>
            </div>
            <Link href="/projects" className="hidden sm:flex items-center gap-1 text-blue-600 font-medium text-sm hover:text-blue-700">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Projects coming soon. Check back shortly.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/projects" className="btn-primary">
              View All Projects <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY ANON INDIA ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Why Choose Us</p>
            <h2 className="section-heading">The ANON INDIA Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'RERA Registered',          desc: 'All projects registered under RERA. Full legal compliance, documented and verifiable.',          icon: '🏛️' },
              { title: 'Clear Land Titles',          desc: 'Every plot has clear, encumbrance-free titles. Legal team verification on every project.',     icon: '📜' },
              { title: 'On-Time Delivery',           desc: '95% of our projects delivered on or before promised date. Accountability is our promise.',     icon: '⏱️' },
              { title: 'Transparent Pricing',        desc: 'No hidden charges. What you see is what you pay. Detailed cost sheet before booking.',         icon: '💯' },
              { title: 'EMI & Loan Assistance',      desc: 'Tie-ups with leading banks. Get home loan approval assistance at zero extra cost.',           icon: '🏦' },
              { title: 'Post-Sale Support',          desc: 'Dedicated relationship manager. Construction updates, document support, and more post-booking.',icon: '🤝' },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                <span className="text-3xl mb-4 block">{icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Testimonials</p>
              <h2 className="section-heading">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {t.photo_url ? (
                      <Image src={t.photo_url} alt={t.client_name} width={40} height={40}
                        className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">{t.client_name[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.client_name}</p>
                      {t.project && <p className="text-xs text-gray-400">{t.project}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Invest in Your Future?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Book a site visit today. Our advisors will guide you through every step — from plot selection to possession.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
              View Projects
            </Link>
            <Link href="/contact"
              className="px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
