import type { Metadata } from 'next'
import LeadForm from '@/components/LeadForm'
import { Award, Users, Building2, MapPin, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ANON INDIA — Rajasthan\'s trusted real estate developer. Our story, mission, values, and RERA registration details.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ANON INDIA</h1>
          <p className="text-blue-200 text-xl max-w-2xl">
            Building trust, one plot at a time. Rajasthan&apos;s most transparent real estate developer since 2008.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Our Story</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">From a Vision to 1000+ Happy Families</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                ANON INDIA was founded with a simple belief: every Indian family deserves a piece of land they can call their own. We started with one project in Jaipur and have grown to deliver 50+ developments across Rajasthan.
              </p>
              <p>
                Our commitment to transparency, legal clarity, and on-time delivery has made us one of Rajasthan&apos;s most trusted real estate brands. Every project we undertake carries the promise of clear titles, RERA compliance, and complete documentation.
              </p>
              <p>
                Today, with over 1000 happy families and 15 years of experience, we continue to open new investment opportunities in emerging corridors across the state.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '15+', label: 'Years of Experience', icon: Award, bg: 'bg-blue-50', color: 'text-blue-600' },
              { value: '50+', label: 'Projects Delivered', icon: Building2, bg: 'bg-green-50', color: 'text-green-600' },
              { value: '1000+', label: 'Happy Families', icon: Users, bg: 'bg-amber-50', color: 'text-amber-600' },
              { value: '8', label: 'Cities Covered', icon: MapPin, bg: 'bg-purple-50', color: 'text-purple-600' },
            ].map(({ value, label, icon: Icon, bg, color }) => (
              <div key={label} className={`${bg} rounded-2xl p-6 text-center`}>
                <Icon size={28} className={`${color} mx-auto mb-2`} />
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-600 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Values */}
        <section>
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Our Values</p>
            <h2 className="text-3xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Transparency',   desc: 'Full cost disclosure, no hidden charges. We share every document you need before you decide.', icon: '🔍' },
              { title: 'Legal Clarity',  desc: 'Every project has clear land title, encumbrance certificate, and RERA registration. No shortcuts.', icon: '⚖️' },
              { title: 'Timely Delivery', desc: 'We respect your time and your money. On-time delivery is our core commitment, backed by RERA.', icon: '⏱️' },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-7 text-center">
                <span className="text-4xl mb-4 block">{icon}</span>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RERA section */}
        <section id="rera" className="bg-blue-900 text-white rounded-3xl p-10">
          <div className="flex items-start gap-5">
            <Shield size={48} className="text-blue-300 shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">RERA Registration Details</h2>
              <p className="text-blue-200 mb-6">
                ANON INDIA is a fully RERA-registered developer under Rajasthan Real Estate Regulatory Authority. All our projects carry individual RERA project registrations, which you can verify on the RERA portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Developer RERA ID',    value: 'RAJ/RERA/DEVELOPER/XXXX/XXXX' },
                  { label: 'Registered Since',     value: '2017 (RERA Implementation)' },
                  { label: 'Authority',            value: 'Rajasthan Real Estate Regulatory Authority' },
                  { label: 'Verification Portal', value: 'rera.rajasthan.gov.in' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4">
                    <p className="text-blue-300 text-xs mb-1">{label}</p>
                    <p className="text-white font-medium text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Invest with Confidence?</h2>
              <p className="text-gray-500">Talk to our team. No pressure, just honest advice on the right investment for your goals.</p>
            </div>
            <LeadForm source="about_page" title="Talk to an Advisor" subtitle="Free 30-minute consultation." />
          </div>
        </section>
      </div>
    </div>
  )
}
