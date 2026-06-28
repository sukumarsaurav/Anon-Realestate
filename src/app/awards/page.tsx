import type { Metadata } from 'next'
import Link from 'next/link'
import { Award } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Awards & Recognition',
  description: 'Recognition earned by ANON INDIA for trust, quality and customer satisfaction.',
}

const awards = [
  { year: '2025', title: 'Trusted Real Estate Brand', body: 'Recognised for transparency and customer satisfaction.' },
  { year: '2024', title: 'Excellence in Project Delivery', body: 'On-time, RERA-compliant handovers across projects.' },
  { year: '2024', title: 'Customer Choice Award', body: 'Highest-rated advisory experience by verified buyers.' },
  { year: '2023', title: 'Emerging Developer of the Year', body: 'For quality-led growth across multiple verticals.' },
]

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        eyebrow="Recognition"
        title="Awards & Recognition"
        subtitle="Trust, earned one happy family at a time."
        image="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1920&q=80&auto=format&fit=crop"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 section">
        <div className="space-y-3">
          {awards.map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center shrink-0"><Award size={22} className="text-gold-700" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-brand-900">{a.title}</p>
                    <span className="text-xs font-medium text-gold-700 bg-gold-50 px-2 py-0.5 rounded">{a.year}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400} className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">Work with an award-winning team</Link>
        </Reveal>
      </div>
    </div>
  )
}
