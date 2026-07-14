import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import LeadForm from '@/components/LeadForm'
import { Award, Users, Building2, MapPin, Shield, Search, Scale, Clock, type LucideIcon } from 'lucide-react'
import PageHero from '@/components/PageHero'
import { getPageContent } from '@/lib/queries'

// Fixed lookup so CMS-stored icon keys can never reference a nonexistent
// component — only these names are ever rendered.
const ICONS: Record<string, LucideIcon> = { Award, Users, Building2, MapPin, Search, Scale, Clock }

type AboutBlocks = {
  story: string[]
  stats: { value: string; label: string; icon: string }[]
  values: { title: string; desc: string; icon: string }[]
  rera: { developer_rera_id: string; registered_since: string; authority: string; verification_portal: string }
}

const FALLBACK: AboutBlocks = {
  story: [
    "ANON INDIA was founded with a simple belief: every Indian family deserves a piece of land they can call their own. We started with one project in Noida and have grown to deliver 50+ developments across Noida & NCR.",
    "Our commitment to transparency, legal clarity, and on-time delivery has made us one of NCR's most trusted real estate brands. Every project we undertake carries the promise of clear titles, RERA compliance, and complete documentation.",
    "Today, with over 1000 happy families and 15 years of experience, we continue to open new investment opportunities in emerging corridors across the state.",
  ],
  stats: [
    { value: '15+', label: 'Years of Experience', icon: 'Award' },
    { value: '50+', label: 'Projects Delivered', icon: 'Building2' },
    { value: '1000+', label: 'Happy Families', icon: 'Users' },
    { value: '8', label: 'Cities Covered', icon: 'MapPin' },
  ],
  values: [
    { title: 'Transparency', desc: 'Full cost disclosure, no hidden charges. We share every document you need before you decide.', icon: 'Search' },
    { title: 'Legal Clarity', desc: 'Every project has clear land title, encumbrance certificate, and RERA registration. No shortcuts.', icon: 'Scale' },
    { title: 'Timely Delivery', desc: 'We respect your time and your money. On-time delivery is our core commitment, backed by RERA.', icon: 'Clock' },
  ],
  rera: {
    developer_rera_id: 'UPRERA/DEVELOPER/XXXX/XXXX',
    registered_since: '2017 (RERA Implementation)',
    authority: 'Uttar Pradesh Real Estate Regulatory Authority',
    verification_portal: 'up-rera.in',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('about')
  return {
    title: page?.meta_title ?? 'About Us',
    description: page?.meta_description ?? "Learn about ANON INDIA — Noida & NCR's trusted real estate developer. Our story, mission, values, and RERA registration details.",
  }
}

export default async function AboutPage() {
  const page = await getPageContent('about')
  const blocks = (page?.blocks && Object.keys(page.blocks).length > 0 ? page.blocks : FALLBACK) as unknown as AboutBlocks

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <PageHero
        size="tall"
        eyebrow={page?.hero_eyebrow ?? 'Since 2008'}
        title={page?.hero_title ?? 'About ANON INDIA'}
        subtitle={page?.hero_subtitle ?? "Building trust, one plot at a time. Noida & NCR's most transparent real estate developer since 2008."}
        image={page?.hero_image_url ?? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format&fit=crop'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section space-y-16">
        {/* Story */}
        <Reveal as="section" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-3">Our Story</p>
            <h2 className="section-heading mb-5">From a Vision to 1000+ Happy Families</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {blocks.story.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {blocks.stats.map(({ value, label, icon }) => {
              const Icon = ICONS[icon] ?? Award
              return (
                <div key={label} className="bg-gold-50 rounded-2xl p-6 text-center">
                  <Icon size={28} className="text-gold-700 mx-auto mb-2" />
                  <p className="font-serif text-3xl font-semibold text-brand-900 tabular-nums-pro">{value}</p>
                  <p className="text-sm text-gray-600 mt-1">{label}</p>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Mission & Values */}
        <Reveal as="section">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">Our Values</p>
            <h2 className="section-heading">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blocks.values.map(({ title, desc, icon }, i) => {
              const Icon = ICONS[icon] ?? Search
              return (
                <Reveal key={title} delay={i * 110} className="bg-white rounded-2xl border border-gray-100 p-7 text-center transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mb-4 mx-auto"><Icon size={22} className="text-gold-700" /></div>
                  <h3 className="h-card mb-3">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </Reveal>
              )
            })}
          </div>
        </Reveal>

        {/* RERA section */}
        <Reveal>
        <section id="rera" className="bg-brand-900 text-white rounded-2xl p-10">
          <div className="flex items-start gap-5">
            <Shield size={48} className="text-gold-400 shrink-0 mt-1" />
            <div>
              <h2 className="font-serif text-2xl font-semibold mb-3">RERA Registration Details</h2>
              <p className="text-gray-200 mb-6">
                ANON INDIA is a fully RERA-registered developer under the Uttar Pradesh Real Estate Regulatory Authority. All our projects carry individual RERA project registrations, which you can verify on the RERA portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Developer RERA ID',    value: blocks.rera.developer_rera_id },
                  { label: 'Registered Since',     value: blocks.rera.registered_since },
                  { label: 'Authority',            value: blocks.rera.authority },
                  { label: 'Verification Portal', value: blocks.rera.verification_portal },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4">
                    <p className="text-gold-400 text-xs mb-1">{label}</p>
                    <p className="text-white font-medium text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        {/* CTA */}
        <Reveal as="section" className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="section-heading mb-3">Ready to Invest with Confidence?</h2>
              <p className="text-gray-500">Talk to our team. No pressure, just honest advice on the right investment for your goals.</p>
            </div>
            <LeadForm source="about_page" title="Talk to an Advisor" subtitle="Free 30-minute consultation." />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
